from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate

user_repository = UserRepository()


def register(
    db: Session,
    user_data: UserCreate,
) -> User:

    if user_repository.get_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists.",
        )

    if user_repository.get_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists.",
        )

    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
        native_language=user_data.native_language,
        is_active=True,
    )

    return user_repository.create(db, user)


def login(
    db: Session,
    credentials: LoginRequest,
) -> Token:

    user = user_repository.get_by_email(
        db,
        credentials.email,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        credentials.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
        }
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
    )