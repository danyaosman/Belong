from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    native_language: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    native_language: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)