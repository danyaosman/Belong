from datetime import datetime

from pydantic import BaseModel

from app.models.conversation import ConversationStatus


class ConversationStart(BaseModel):
    lesson_id: int


class ConversationResponse(BaseModel):
    id: int
    lesson_id: int
    character_id: int
    current_step: int
    status: ConversationStatus
    started_at: datetime
    ended_at: datetime | None = None

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    message: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True