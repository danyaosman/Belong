from sqlalchemy.orm import Session

from app.models.lesson import Lesson


class LessonRepository:

    def get_all(
        self,
        db: Session,
    ):

        return (
            db.query(Lesson)
            .order_by(Lesson.order)
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        lesson_id: int,
    ):

        return (
            db.query(Lesson)
            .filter(
                Lesson.id == lesson_id
            )
            .first()
        )