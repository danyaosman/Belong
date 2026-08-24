from fastapi import HTTPException
from sqlalchemy.orm import Session

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
from app.services.conversation.evaluator import (
    evaluate_response,
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

    conversation = Conversation(
        user_id=user_id,
        lesson_id=lesson.id,
        character_id=lesson.character_id,
        current_step=1,
        status=ConversationStatus.ACTIVE,
    )

    return conversation_repository.create(
        db,
        conversation,
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

    user_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.USER,
        message=message.strip(),
    )

    conversation_message_repository.create(
        db,
        user_message,
    )

    evaluation = evaluate_response(
        message,
        current_step,
    )

    if not evaluation["correct"]:
        character_message = ConversationMessage(
            conversation_id=conversation.id,
            sender=MessageSender.CHARACTER,
            message=evaluation["feedback"],
        )

        conversation_message_repository.create(
            db,
            character_message,
        )

        db.commit()

        return {
            "correct": False,
            "message": character_message.message,
            "hint": evaluation["hint"],
            "current_step": conversation.current_step,
            "completed": False,
        }

    next_step_id = conversation.current_step + 1

    if next_step_id > len(steps):
        conversation.status = ConversationStatus.COMPLETED

        character_message = ConversationMessage(
            conversation_id=conversation.id,
            sender=MessageSender.CHARACTER,
            message=current_step["character_message"],
        )

        conversation_message_repository.create(
            db,
            character_message,
        )

        db.commit()

        return {
            "correct": True,
            "message": character_message.message,
            "hint": None,
            "current_step": conversation.current_step,
            "completed": True,
        }

    conversation.current_step = next_step_id

    next_step = next(
        step
        for step in steps
        if step["id"] == next_step_id
    )

    character_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.CHARACTER,
        message=next_step["character_message"],
    )

    conversation_message_repository.create(
        db,
        character_message,
    )

    db.commit()

    return {
        "correct": True,
        "message": character_message.message,
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