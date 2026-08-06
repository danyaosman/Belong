from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lesson import LessonResponse, LessonContentResponse
from app.schemas.vocabulary import VocabularyResponse
from app.schemas.grammar import GrammarResponse
from app.schemas.exercise import ExerciseResponse

from app.services.lesson.service import (
    get_lesson,
    get_lessons,
    get_lesson_content
)
from app.services.vocabulary.service import (
    get_lesson_vocabulary,
    get_vocabulary,
)

from app.services.grammar.service import (
    get_lesson_grammar,
    get_grammar,
)

from app.services.exercise.service import (
    get_lesson_exercises,
    get_exercise,
)

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)


@router.get(
    "",
    response_model=list[LessonResponse],
)
def read_lessons(
    db: Session = Depends(get_db),
):
    return get_lessons(db)


@router.get(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def read_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson(
        db,
        lesson_id,
    )

@router.get(
    "/{lesson_id}/content",
    response_model=LessonContentResponse,
)
def read_lesson_content(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_content(
        db,
        lesson_id,
    )

@router.get(
    "/{lesson_id}/vocabulary",
    response_model=list[VocabularyResponse],
)
def read_lesson_vocabulary(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_vocabulary(
        db,
        lesson_id,
    )


@router.get(
    "/{lesson_id}/grammar",
    response_model=list[GrammarResponse],
)
def read_lesson_grammar(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_grammar(
        db,
        lesson_id,
    )


@router.get(
    "/{lesson_id}/exercises",
    response_model=list[ExerciseResponse],
)
def read_lesson_exercises(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_exercises(
        db,
        lesson_id,
    )