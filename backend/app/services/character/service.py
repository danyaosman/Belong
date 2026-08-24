from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.character_repository import CharacterRepository

repository = CharacterRepository()


def get_characters(
    db: Session,
):
    return repository.get_all(db)


def get_character(
    db: Session,
    character_id: int,
):
    character = repository.get_by_id(
        db,
        character_id,
    )

    if character is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found.",
        )

    return character