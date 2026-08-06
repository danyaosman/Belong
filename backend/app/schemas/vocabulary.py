from pydantic import BaseModel


class VocabularyResponse(BaseModel):
    id: int
    turkish: str
    english: str
    arabic: str

    pronunciation: str | None = None
    example_sentence: str | None = None
    example_translation: str | None = None
    audio_url: str | None = None

    model_config = {
        "from_attributes": True
    }