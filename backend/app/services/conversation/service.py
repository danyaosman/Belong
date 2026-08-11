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

    user_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.USER,
        message=message.strip(),
    )

    conversation_message_repository.create(
        db,
        user_message,
    )

    # Temporary response until Gemini is implemented.
    character_message = ConversationMessage(
        conversation_id=conversation.id,
        sender=MessageSender.CHARACTER,
        message="Merhaba! Ben Dilara. Senin adın ne?",
    )

    conversation_message_repository.create(
        db,
        character_message,
    )

    return character_message


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