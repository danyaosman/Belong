from pydantic import BaseModel


class CharacterResponse(BaseModel):
    id: int
    name: str
    age: int
    occupation: str
    personality: str
    background: str
    avatar_url: str | None = None

    model_config = {
        "from_attributes": True
    }