from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False)

    level: Mapped[int] = mapped_column(Integer, nullable=False)

    lesson_number: Mapped[int] = mapped_column(Integer, nullable=False)

    thumbnail_url: Mapped[str | None] = mapped_column(String(255))

    conversation_context: Mapped[str] = mapped_column(Text)

    conversation_goal: Mapped[str] = mapped_column(Text)

    success_criteria: Mapped[str] = mapped_column(Text)

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