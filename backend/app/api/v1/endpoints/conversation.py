from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.conversation import (
    ConversationResponse,
    ConversationStart,
    MessageCreate,
    MessageResponse,
)

from app.services.conversation.service import (
    get_conversation,
    get_conversation_messages,
    get_user_conversations,
    send_message,
    start_conversation,
)

# Change this import to match your existing authentication dependency.
from app.dependencies.get_current_user import get_current_user


router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)

@router.post(
    "/start",
    response_model=ConversationResponse,
)
def create_conversation(
    data: ConversationStart,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return start_conversation(
        db,
        current_user.id,
        data.lesson_id,
    )

@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_conversation(
        db,
        conversation_id,
        current_user.id,
    )

@router.get(
    "",
    response_model=list[ConversationResponse],
)
def read_user_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_user_conversations(
        db,
        current_user.id,
    )

@router.post(
    "/{conversation_id}/messages",
    response_model=MessageResponse,
)
def create_message(
    conversation_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return send_message(
        db,
        conversation_id,
        current_user.id,
        data.message,
    )

@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def read_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_conversation_messages(
        db,
        conversation_id,
        current_user.id,
    )