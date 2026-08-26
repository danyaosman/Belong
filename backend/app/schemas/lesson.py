from pydantic import BaseModel

from app.schemas.vocabulary import VocabularyResponse
from app.schemas.grammar import GrammarResponse
from app.schemas.exercise import ExerciseResponse


class LessonResponse(BaseModel):
    id: int
    title: str
    description: str
    level: int
    lesson_number: int
    character_id: int
    thumbnail_url: str | None

    model_config = {
        "from_attributes": True
    }


class LessonContentResponse(LessonResponse):
    vocabulary: list[VocabularyResponse]
    grammar: list[GrammarResponse]
    exercises: list[ExerciseResponse]