from datetime import datetime

from sqlalchemy import Boolean, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    native_language: Mapped[str] = mapped_column(
        String(20),
        default="English",
        nullable=False,
    )

    hearts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=10,
    )

    xp: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    last_heart_lost_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # current_lesson_id: Mapped[int | None] = mapped_column(
    #    ForeignKey("lessons.id"),
    #    nullable=True,
    #)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )


    #current_lesson = relationship("Lesson")
    