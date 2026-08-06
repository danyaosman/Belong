from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Grammar(Base):
    __tablename__ = "grammar"

    id: Mapped[int] = mapped_column(primary_key=True)

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(String(100), nullable=False)

    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    example: Mapped[str] = mapped_column(Text, nullable=False)

    translation: Mapped[str] = mapped_column(Text, nullable=False)

    lesson = relationship(
        "Lesson",
        back_populates="grammar",
    )