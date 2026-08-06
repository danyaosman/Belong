from pydantic import BaseModel


class LessonResponse(BaseModel):
    id: int
    title: str
    description: str
    level: int
    lesson_number: int
    thumbnail_url: str | None

    model_config = {
        "from_attributes": True
    }