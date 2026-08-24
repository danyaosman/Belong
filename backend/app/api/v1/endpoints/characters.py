from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.character import CharacterResponse
from app.services.character.service import (
    get_character,
    get_characters,
)

router = APIRouter(
    prefix="/characters",
    tags=["Characters"],
)


@router.get(
    "",
    response_model=list[CharacterResponse],
)
def read_characters(
    db: Session = Depends(get_db),
):
    return get_characters(db)


@router.get(
    "/{character_id}",
    response_model=CharacterResponse,
)
def read_character(
    character_id: int,
    db: Session = Depends(get_db),
):
    return get_character(
        db,
        character_id,
    )