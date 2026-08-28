import json 

from fastapi import HTTPException
from sqlalchemy.orm import Session

from datetime import datetime

from app.models.conversation import (
    Conversation,
    ConversationStatus,
)
from app.models.conversation_message import (
    ConversationMessage,
    MessageSender,
)
from app.repositories.conversation_repository import conversation_repository
from app.repositories.convo_message_repository import (
    conversation_message_repository,
)
from app.repositories.lesson_repository import LessonRepository

from app.services.conversation.script_loader import (
    load_lesson_script,
)

from app.services.lesson.service import get_lesson
from app.schemas.conversation import (
    ConversationResponse,
    ConversationContentResponse,
    ConversationStepResponse,
)
from app.services.ai.gemini import evaluate_conversation_response


def get_lesson_conversation(
    db: Session,
    lesson_id: int,
):
    lesson = get_lesson(
        db,
        lesson_id,
    )

    return ConversationContentResponse(
        context=lesson.conversation_context,
        goal=lesson.conversation_goal,
        success_criteria=lesson.success_criteria
    )


def start_conversation(
    db: Session,
    user_id: int,
    lesson_id: int,
):
    lesson_repository = LessonRepository()
    lesson = lesson_repository.get_by_id(
        db,
        lesson_id,
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found.",
        )

    if not lesson.character_id:
        raise HTTPException(
            status_code=400,
            detail="This lesson does not have a character assigned.",
        )

    script = load_lesson_script(
        lesson.level,
        lesson.lesson_number,
    )

    steps = script["conversation"]["steps"]

    if not steps:
        raise HTTPException(
            status_code=400,
            detail="This lesson has no conversation steps.",
        )

    first_step = steps[0]

    conversation = Conversation(
        user_id=user_id,
        lesson_id=lesson.id,
        character_id=lesson.character_id,
        current_step=1,
        status=ConversationStatus.ACTIVE,
    )

    conversation = conversation_repository.create(
        db,
        conversation,
    )

    return ConversationResponse(
        id=conversation.id,
        lesson_id=conversation.lesson_id,
        character_id=conversation.character_id,
        character_avatar_url=conversation.character.avatar_url,
        current_step=conversation.current_step,
        status=conversation.status,
        started_at=conversation.started_at,
        ended_at=conversation.ended_at,
        first_message=first_step["character_message"],
    )


def get_conversation(
    db: Session,
    conversation_id: int,
    user_id: int,
):
    conversation = conversation_repository.get_by_id(
        db,
        conversation_id,
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    if conversation.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this conversation.",
        )

    return conversation


def get_user_conversations(
    db: Session,
    user_id: int,
):
    return conversation_repository.get_by_user(
        db,
        user_id,
    )


def send_message(
    db: Session,
    conversation_id: int,
    user_id: int,
    message: str,
):
    conversation = get_conversation(
        db,
        conversation_id,
        user_id,
    )

    if conversation.status != ConversationStatus.ACTIVE:
        raise HTTPException(
            status_code=400,
            detail="This conversation is no longer active.",
        )

    if not message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    lesson = conversation.lesson
    character = conversation.character

    script = load_lesson_script(
        lesson.level,
        lesson.lesson_number,
    )

    steps = script["conversation"]["steps"]

    current_step = next(
        (
            step
            for step in steps
            if step["id"] == conversation.current_step
        ),
        None,
    )

    if current_step is None:
        raise HTTPException(
            status_code=500,
            detail="Current conversation step not found.",
        )

    # ---------------------------------------------------------
    # Save user's message
    # ---------------------------------------------------------

    user_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.USER,
        message=message.strip(),
    )

    conversation_message_repository.create(
        db,
        user_message,
    )

    # ---------------------------------------------------------
    # Ask Gemini to evaluate the response
    # ---------------------------------------------------------

    try:
        evaluation, interaction_id = (
            evaluate_conversation_response(
                character_name=character.name,
                character_personality=character.personality,
                character_occupation=character.occupation,
                character_background=character.background,
                lesson_title=lesson.title,
                lesson_context=lesson.conversation_context,
                lesson_goal=lesson.conversation_goal,
                success_criteria=lesson.success_criteria,
                current_step=current_step,
                user_message=message.strip(),
                previous_interaction_id=(
                    conversation.gemini_interaction_id
                ),
                initial_character_message=steps[0][
                    "character_message"
                ],
            )
        )

    except Exception as exc:
        db.rollback()

        print(
            "Gemini conversation error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=502,
            detail="The AI conversation service is temporarily unavailable.",
        )

    # ---------------------------------------------------------
    # Save Gemini interaction ID
    # ---------------------------------------------------------

    conversation.gemini_interaction_id = interaction_id

    # ---------------------------------------------------------
    # Incorrect response
    # ---------------------------------------------------------

    if not evaluation.correct:

        character_text = evaluation.character_message

        character_message = ConversationMessage(
            conversation_id=conversation.id,
            sender=MessageSender.CHARACTER,
            message=character_text,
        )

        conversation_message_repository.create(
            db,
            character_message,
        )

        db.commit()

        return {
            "correct": False,
            "message": character_text,
            "hint": evaluation.hint,
            "current_step": conversation.current_step,
            "completed": False,
        }

    # ---------------------------------------------------------
    # Correct response
    # ---------------------------------------------------------

    next_step_id = conversation.current_step + 1

    # ---------------------------------------------------------
    # Lesson completed
    # ---------------------------------------------------------

    if next_step_id > len(steps):

        conversation.status = ConversationStatus.COMPLETED
        conversation.ended_at = datetime.utcnow()

        character_text = evaluation.character_message

        character_message = ConversationMessage(
            conversation_id=conversation.id,
            sender=MessageSender.CHARACTER,
            message=character_text,
        )

        conversation_message_repository.create(
            db,
            character_message,
        )

        db.commit()

        return {
            "correct": True,
            "message": character_text,
            "hint": None,
            "current_step": conversation.current_step,
            "completed": True,
        }

    # ---------------------------------------------------------
    # Advance to next step
    # ---------------------------------------------------------

    conversation.current_step = next_step_id

    next_step = next(
        step
        for step in steps
        if step["id"] == next_step_id
    )

    character_text = next_step["character_message"]

    character_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.CHARACTER,
        message=character_text,
    )

    conversation_message_repository.create(
        db,
        character_message,
    )

    db.commit()

    return {
        "correct": True,
        "message": character_text,
        "hint": None,
        "current_step": conversation.current_step,
        "completed": False,
    }


def get_conversation_messages(
    db: Session,
    conversation_id: int,
    user_id: int,
):
    # Make sure the user owns the conversation.
    get_conversation(
        db,
        conversation_id,
        user_id,
    )

    return conversation_message_repository.get_by_conversation(
        db,
        conversation_id,
    )