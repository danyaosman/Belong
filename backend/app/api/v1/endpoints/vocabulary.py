from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.vocabulary import VocabularyResponse
from app.services.vocabulary.service import (
    get_lesson_vocabulary,
    get_vocabulary,
)

router = APIRouter(
    tags=["Vocabulary"],
)


@router.get(
    "/lesson/{lesson_id}/vocabulary",
    response_model=list[VocabularyResponse],
)
def read_lesson_vocabulary(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_vocabulary(
        db,
        lesson_id,
    )


@router.get(
    "/{vocabulary_id}",
    response_model=VocabularyResponse,
)
def read_vocabulary(
    vocabulary_id: int,
    db: Session = Depends(get_db),
):
    return get_vocabulary(
        db,
        vocabulary_id,
    )