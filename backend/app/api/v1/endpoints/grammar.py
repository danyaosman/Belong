from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.grammar import GrammarResponse
from app.services.grammar.service import (
    get_grammar,
    get_lesson_grammar,
)

router = APIRouter(
    tags=["Grammar"],
)


@router.get(
    "/lesson/{lesson_id}/grammar",
    response_model=list[GrammarResponse],
)
def read_lesson_grammar(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    return get_lesson_grammar(
        db,
        lesson_id,
    )


@router.get(
    "/{grammar_id}",
    response_model=GrammarResponse,
)
def read_grammar(
    grammar_id: int,
    db: Session = Depends(get_db),
):
    return get_grammar(
        db,
        grammar_id,
    )