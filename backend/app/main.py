from fastapi import FastAPI

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

from app.api.v1.router import api_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Belong API!",
        "version": settings.APP_VERSION,
    }