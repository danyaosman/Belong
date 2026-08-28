from pydantic import BaseModel


class GeminiConversationResponse(BaseModel):
    correct: bool
    character_message: str
    feedback: str | None = None
    hint: str | None = None