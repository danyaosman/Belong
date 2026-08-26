from sqlalchemy import Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.db.base import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False)

    level: Mapped[int] = mapped_column(Integer, nullable=False)

    lesson_number: Mapped[int] = mapped_column(Integer, nullable=False)

    conversation_context: Mapped[str] = mapped_column(Text)

    conversation_goal: Mapped[str] = mapped_column(Text)

    success_criteria: Mapped[str] = mapped_column(
        JSON,
        nullable=False
    )

    thumbnail_url: Mapped[str | None] = mapped_column(String(255))

    character_id: Mapped[int] = mapped_column(
        ForeignKey("characters.id"),
        nullable=False,
    )

    character = relationship(
        "Character",
        back_populates="lessons",
    )
    vocabulary = relationship(
        "Vocabulary",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )

    grammar = relationship(
        "Grammar",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )

    exercises = relationship(
        "Exercise",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )

    conversations = relationship(
    "Conversation",
    back_populates="lesson",
    )