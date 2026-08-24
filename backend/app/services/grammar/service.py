from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.grammar_repository import GrammarRepository

repository = GrammarRepository()


def get_lesson_grammar(
    db: Session,
    lesson_id: int,
):
    return repository.get_by_lesson(
        db,
        lesson_id,
    )


def get_grammar(
    db: Session,
    grammar_id: int,
):
    grammar = repository.get_by_id(
        db,
        grammar_id,
    )

    if grammar is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grammar not found.",
        )

    return grammar