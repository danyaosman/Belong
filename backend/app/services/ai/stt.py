import os
import tempfile

from google import genai

from app.core.config import settings


MODEL_NAME = "gemini-3.5-transcribe"

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def transcribe_audio(audio_data: bytes, mime_type: str) -> str:
    if not audio_data:
        raise ValueError("Audio data cannot be empty.")

    suffix_map = {
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
        "audio/mpeg": ".mp3",
        "audio/mp3": ".mp3",
        "audio/mp4": ".m4a",
        "audio/m4a": ".m4a",
        "audio/aac": ".aac",
        "audio/ogg": ".ogg",
        "audio/flac": ".flac",
        "audio/webm": ".webm",
    }

    suffix = suffix_map.get(mime_type, ".m4a")

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(audio_data)
            temp_path = temp_file.name

        audio_file = client.files.upload(
            file=temp_path,
            config={
                "mime_type": mime_type,
            },
        )

        interaction = client.interactions.create(
            model=MODEL_NAME,
            input=[
                {
                    "type": "audio",
                    "uri": audio_file.uri,
                    "mime_type": audio_file.mime_type or mime_type,
                }
            ],
            generation_config={
                "transcription_config": {
                    "language_codes": ["tr-TR"],
                    "mode": "smart",
                }
            },
        )

        if not interaction.output_text:
            raise RuntimeError("Gemini returned an empty transcription.")

        return interaction.output_text.strip()

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)