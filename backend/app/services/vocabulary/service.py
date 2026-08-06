from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.vocabulary_repository import VocabularyRepository

repository = VocabularyRepository()


def get_lesson_vocabulary(
    db: Session,
    lesson_id: int,
):
    return repository.get_by_lesson(
        db,
        lesson_id,
    )


def get_vocabulary(
    db: Session,
    vocabulary_id: int,
):
    vocabulary = repository.get_by_id(
        db,
        vocabulary_id,
    )

    if vocabulary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vocabulary not found.",
        )

    return vocabulary