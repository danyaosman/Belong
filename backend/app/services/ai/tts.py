import io
import wave

from google import genai
from google.genai import types

from app.core.config import settings


MODEL_NAME = "gemini-3.1-flash-tts-preview"

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def pcm_to_wav(pcm_data: bytes) -> bytes:
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 16-bit PCM
        wav_file.setframerate(24000)
        wav_file.writeframes(pcm_data)

    wav_data = buffer.getvalue()

    print(
        "Generated WAV:",
        len(wav_data),
        "bytes",
        "header:",
        wav_data[:12],
    )

    return wav_data


def generate_speech(text: str) -> bytes:
    if not text.strip():
        raise ValueError("Text cannot be empty.")

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
        raise RuntimeError("Gemini returned no candidates.")

    parts = response.candidates[0].content.parts

    for part in parts:
        if part.inline_data and part.inline_data.data:
            audio_data = part.inline_data.data

            print(
                "Gemini audio:",
                len(audio_data),
                "bytes",
                "mime_type:",
                part.inline_data.mime_type,
            )
            return pcm_to_wav(part.inline_data.data)

    raise RuntimeError("Gemini returned no audio.")