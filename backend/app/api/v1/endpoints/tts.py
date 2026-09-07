from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel

from app.services.ai.tts import generate_speech


router = APIRouter(
    prefix="/tts",
    tags=["TTS"],
)


class TTSRequest(BaseModel):
    text: str


@router.post("")
def text_to_speech(request: TTSRequest):
    try:
        audio = generate_speech(request.text)

    except Exception as exc:
        print("Gemini TTS error:", repr(exc))

        raise

    return Response(
        content=audio,
        media_type="audio/wav",
    )