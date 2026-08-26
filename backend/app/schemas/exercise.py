from pydantic import BaseModel

from app.models.exercise import ExerciseType


class ExerciseOptionResponse(BaseModel):
    id: int
    text: str
    is_correct: bool
    order_index: int | None = None

    model_config = {
        "from_attributes": True
    }


class ExerciseResponse(BaseModel):
    id: int
    type: ExerciseType
    question: str
    explanation: str | None = None
    options: list[ExerciseOptionResponse]

    model_config = {
        "from_attributes": True
    }