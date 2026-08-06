from sqlalchemy.orm import Session

from app.models.vocabulary import Vocabulary


class VocabularyRepository:

    def get_by_lesson(
        self,
        db: Session,
        lesson_id: int,
    ):
        return (
            db.query(Vocabulary)
            .filter(Vocabulary.lesson_id == lesson_id)
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        vocabulary_id: int,
    ):
        return (
            db.query(Vocabulary)
            .filter(Vocabulary.id == vocabulary_id)
            .first()
        )