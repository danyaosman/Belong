from fastapi import FastAPI

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings

from app.api.v1.router import api_router

from fastapi.staticfiles import StaticFiles

from pathlib import Path

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

BASE_DIR = Path(__file__).resolve().parent.parent

app.mount(
    "/assets",
    StaticFiles(directory=BASE_DIR / "assets"),
    name="assets",
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Belong API!",
        "version": settings.APP_VERSION,
    }