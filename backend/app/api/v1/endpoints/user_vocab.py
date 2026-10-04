from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.get_current_user import (
    get_current_user,
)
from app.models.user import User
from app.schemas.user_vocabulary import (
    UserVocabularyResponse,
)
from app.services.vocabulary.user_vocabulary import (
    get_user_vocabulary,
)


router = APIRouter(
    prefix="/vocabulary",
    tags=["Vocabulary"],
)


@router.get(
    "/me",
    response_model=list[UserVocabularyResponse],
)
def read_my_vocabulary(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    return get_user_vocabulary(
        db,
        current_user.id,
    )