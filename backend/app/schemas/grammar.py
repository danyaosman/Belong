from pydantic import BaseModel


class GrammarResponse(BaseModel):
    id: int
    title: str
    explanation: str
    example: str
    translation: str

    model_config = {
        "from_attributes": True
    }