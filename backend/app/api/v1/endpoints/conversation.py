from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.get_current_user import get_current_user
from app.schemas.conversation import (
    ConversationResponse,
    ConversationStart,
    ConversationTurnResponse,
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
    #current_user=Depends(get_current_user),
):
    return start_conversation(
        db,
        user_id = 1,
        lesson_id=data.lesson_id,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    #current_user=Depends(get_current_user),
):
    return get_conversation(
        db,
        conversation_id,
        user_id=1,
    )


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def read_user_conversations(
    db: Session = Depends(get_db),
    #current_user=Depends(get_current_user),
):
    return get_user_conversations(
        db,
        user_id=1,
    )


@router.post(
    "/{conversation_id}/messages",
    response_model=ConversationTurnResponse,
)
def create_message(
    conversation_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    #current_user=Depends(get_current_user),
):
    return send_message(
        db,
        conversation_id,
        user_id=1,
        message=data.message,
    )


@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def read_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    #current_user=Depends(get_current_user),
):
    return get_conversation_messages(
        db,
        conversation_id,
        user_id=1,
    )