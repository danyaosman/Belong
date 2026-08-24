from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload

from app.models.exercise import Exercise


class ExerciseRepository:

    def get_by_lesson(
        self,
        db: Session,
        lesson_id: int,
    ):
        return (
            db.query(Exercise)
            .options(selectinload(Exercise.options))
            .filter(
                Exercise.lesson_id == lesson_id
            )
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        exercise_id: int,
    ):
        return (
            db.query(Exercise)
            .options(selectinload(Exercise.options))
            .filter(
                Exercise.id == exercise_id
            )
            .first()
        )