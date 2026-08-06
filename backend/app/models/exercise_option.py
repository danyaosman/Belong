from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id: Mapped[int] = mapped_column(primary_key=True)

    exercise_id: Mapped[int] = mapped_column(
        ForeignKey("exercises.id"),
        nullable=False,
    )

    text: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    order_index: Mapped[int | None] = mapped_column(Integer)

    exercise = relationship(
        "Exercise",
        back_populates="options",
    )