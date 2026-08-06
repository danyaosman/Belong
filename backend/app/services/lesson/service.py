from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.lesson_repository import LessonRepository

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
            detail="Lesson not found.",
        )

    return lesson