from datetime import datetime

from pydantic import BaseModel

from app.models.conversation import ConversationStatus

class ConversationStepResponse(BaseModel):
    id: int
    character_message: str
    expected_intent: str
    target_phrases: list[str]
    hint: str
    required: bool


class ConversationContentResponse(BaseModel):
    context: str
    goal: str
    success_criteria: list[str]



class ConversationStart(BaseModel):
    lesson_id: int


class ConversationResponse(BaseModel):
    id: int
    lesson_id: int
    character_id: int
    character_avatar_url: str | None = None
    current_step: int
    status: ConversationStatus
    started_at: datetime
    ended_at: datetime | None = None
    first_message: str

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


class ConversationTurnResponse(BaseModel):
    correct: bool
    message: str
    hint: str | None = None
    current_step: int
    completed: bool