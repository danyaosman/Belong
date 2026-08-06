import random

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.exercise_repository import ExerciseRepository

repository = ExerciseRepository()


def get_lesson_exercises(
    db: Session,
    lesson_id: int,
):
    exercises = repository.get_by_lesson(
        db,
        lesson_id,
    )

    return random.sample(
        exercises,
        min(3, len(exercises)),
    )


def get_exercise(
    db: Session,
    exercise_id: int,
):
    exercise = repository.get_by_id(
        db,
        exercise_id,
    )

    if exercise is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found.",
        )

    return exercise