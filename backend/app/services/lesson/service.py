from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.lesson_repository import LessonRepository
from app.services.vocabulary.service import get_lesson_vocabulary
from app.services.grammar.service import get_lesson_grammar
from app.services.exercise.service import get_lesson_exercises
from app.schemas.lesson import LessonContentResponse

lesson_repository = LessonRepository()


def get_lessons(
    db: Session,
):
    return lesson_repository.get_all(db)


def get_lesson(
    db: Session,
    lesson_id: int,
):

    lesson = lesson_repository.get_by_id(
        db,
        lesson_id,
    )

    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson {lesson_id} not found.",
        )

    return lesson

def get_lesson_content(
    db: Session,
    lesson_id: int,
):
    lesson = get_lesson(db, lesson_id)

    return LessonContentResponse(
    id=lesson.id,
    title=lesson.title,
    character_id=lesson.character_id,
    description=lesson.description,
    level=lesson.level,
    lesson_number=lesson.lesson_number,
    thumbnail_url=lesson.thumbnail_url,
    vocabulary=get_lesson_vocabulary(db, lesson_id),
    grammar=get_lesson_grammar(db, lesson_id),
    exercises=get_lesson_exercises(db, lesson_id),
)