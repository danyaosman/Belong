from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.ai.stt import transcribe_audio


router = APIRouter(prefix="/stt", tags=["STT"])


@router.post("")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        audio_data = await file.read()

        if not audio_data:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty.",
            )

        text = transcribe_audio(
            audio_data=audio_data,
            mime_type=file.content_type or "audio/m4a",
        )

        return {
            "text": text,
        }

    except HTTPException:
        raise

    except Exception as exc:
        print("Gemini STT error:", repr(exc))
        raise HTTPException(
            status_code=502,
            detail="The speech-to-text service is temporarily unavailable.",
        )