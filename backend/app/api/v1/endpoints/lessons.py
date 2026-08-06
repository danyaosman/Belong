from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.lesson import LessonResponse
from app.services.lesson.service import (
    get_lesson,
    get_lessons,
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