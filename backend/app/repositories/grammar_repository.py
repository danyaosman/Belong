from sqlalchemy.orm import Session

from app.models.grammar import Grammar


class GrammarRepository:

    def get_by_lesson(
        self,
        db: Session,
        lesson_id: int,
    ):
        return (
            db.query(Grammar)
            .filter(Grammar.lesson_id == lesson_id)
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        grammar_id: int,
    ):
        return (
            db.query(Grammar)
            .filter(Grammar.id == grammar_id)
            .first()
        )