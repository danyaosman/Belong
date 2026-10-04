from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserVocabulary(Base):
    __tablename__ = "user_vocabulary"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    vocabulary_id: Mapped[int] = mapped_column(
        ForeignKey("vocabulary.id"),
        nullable=False,
    )

    learned_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="user_vocabulary",
    )

    vocabulary = relationship(
        "Vocabulary",
        back_populates="user_vocabulary",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "vocabulary_id",
            name="uq_user_vocabulary",
        ),
    )