from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id: Mapped[int] = mapped_column(primary_key=True)

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False,
    )

    turkish: Mapped[str] = mapped_column(String(100), nullable=False)
    english: Mapped[str] = mapped_column(String(100), nullable=False)
    arabic: Mapped[str] = mapped_column(String(100), nullable=False)

    pronunciation: Mapped[str | None] = mapped_column(String(100))
    example_sentence: Mapped[str | None] = mapped_column(Text)
    example_translation: Mapped[str | None] = mapped_column(Text)
    audio_url: Mapped[str | None] = mapped_column(String(255))

    lesson = relationship(
        "Lesson",
        back_populates="vocabulary",
    )