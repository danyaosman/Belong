from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate, UserResponse
from app.services.auth.service import login, register

from app.dependencies.get_current_user import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return register(db, user)


@router.post(
    "/login",
    response_model=Token
)
def login_user(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    return login(db, credentials)

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user