from pydantic import BaseModel

from app.models.exercise import ExerciseType


class ExerciseOptionResponse(BaseModel):
    id: int
    text: str

    model_config = {
        "from_attributes": True
    }


class ExerciseResponse(BaseModel):
    id: int
    type: ExerciseType
    question: str
    options: list[ExerciseOptionResponse]

    model_config = {
        "from_attributes": True
    }