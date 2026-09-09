import hashlib
import io
import os
import wave

from google import genai
from google.genai import types

from app.core.config import settings


MODEL_NAME = "gemini-3.1-flash-tts-preview"

CACHE_DIR = "/app/storage/tts"

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def get_cache_path(text: str) -> str:
    cache_key = hashlib.sha256(
        f"{MODEL_NAME}|Kore|tr-TR|{text}".encode("utf-8")
    ).hexdigest()

    return os.path.join(
        CACHE_DIR,
        f"{cache_key}.wav",
    )


def pcm_to_wav(pcm_data: bytes) -> bytes:
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(24000)
        wav_file.writeframes(pcm_data)

    return buffer.getvalue()


def generate_speech(text: str) -> bytes:
    if not text.strip():
        raise ValueError(
            "Text cannot be empty."
        )

    os.makedirs(
        CACHE_DIR,
        exist_ok=True,
    )

    cache_path = get_cache_path(text)

    # Return cached audio if it already exists.
    if os.path.exists(cache_path):
        print(
            "TTS cache hit:",
            cache_path,
        )

        with open(
            cache_path,
            "rb",
        ) as audio_file:
            return audio_file.read()

    print(
        "TTS cache miss. Generating:",
        text,
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Kore",
                    )
                ),
                language_code="tr-TR",
            ),
        ),
    )

    if not response.candidates:
        raise RuntimeError(
            "Gemini returned no candidates."
        )

    parts = (
        response.candidates[0]
        .content
        .parts
    )

    for part in parts:
        if (
            part.inline_data
            and part.inline_data.data
        ):
            audio_data = (
                part.inline_data.data
            )

            wav_data = pcm_to_wav(
                audio_data
            )

            with open(
                cache_path,
                "wb",
            ) as audio_file:
                audio_file.write(
                    wav_data
                )

            print(
                "TTS audio cached:",
                cache_path,
            )

            return wav_data

    raise RuntimeError(
        "Gemini returned no audio."
    )