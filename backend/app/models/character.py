from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Character(Base):
    __tablename__ = "characters"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    age: Mapped[int]

    occupation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    personality: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    background: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    system_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(255)
    )

    voice_id: Mapped[str | None] = mapped_column(
        String(255)
    )

    lessons = relationship(
        "Lesson",
        back_populates="character",
    )