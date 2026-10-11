from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserVocabularyResponse(BaseModel):
    id: int
    vocabulary_id: int
    turkish: str
    english: str
    arabic: str
    pronunciation: str | None
    example_sentence: str | None
    example_translation: str | None
    learned_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )