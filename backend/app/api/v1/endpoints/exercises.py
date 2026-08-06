from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.exercise import ExerciseResponse
from app.services.exercise.service import (
    get_exercise,
    get_lesson_exercises,
)

router = APIRouter(
    prefix="/lessons/{lesson_id}/exercises",
    tags=["Exercises"],
)


@router.get(
    "",
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


@router.get(
    "/{exercise_id}",
    response_model=ExerciseResponse,
)
def read_exercise(
    lesson_id: int,  # included because it's part of the route
    exercise_id: int,
    db: Session = Depends(get_db),
):
    return get_exercise(
        db,
        exercise_id,
    )