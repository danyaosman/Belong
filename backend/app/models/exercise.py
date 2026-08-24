from enum import Enum

from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ExerciseType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_BLANK = "fill_blank"
    TRANSLATION = "translation"
    ORDER_WORDS = "order_words"
    MATCHING = "matching"


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id"),
        nullable=False,
    )

    type: Mapped[ExerciseType] = mapped_column(
        SQLAlchemyEnum(ExerciseType),
        nullable=False,
    )

    question: Mapped[str] = mapped_column(Text, nullable=False)

    explanation: Mapped[str | None] = mapped_column(Text)

    lesson = relationship(
        "Lesson",
        back_populates="exercises",
    )

    options = relationship(
        "ExerciseOption",
        back_populates="exercise",
        cascade="all, delete-orphan",
    )