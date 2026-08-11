from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    lessons,
    characters,
    conversation
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(lessons.router)
api_router.include_router(characters.router)
api_router.include_router(conversation.router)