from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.user import User


MAX_HEARTS = 10
HEART_REGENERATION_MINUTES = 30

COMPLETION_XP = 50
PERFECT_BONUS_XP = 25


def get_current_hearts(db: Session, user: User) -> int:
    """
    Calculate and update regenerated hearts based on elapsed time.
    """

    if user.hearts >= MAX_HEARTS:
        user.hearts = MAX_HEARTS
        user.last_heart_lost_at = None
        return user.hearts

    if user.last_heart_lost_at is None:
        return user.hearts

    now = datetime.now(timezone.utc)

    elapsed_seconds = (
        now - user.last_heart_lost_at
    ).total_seconds()

    regenerated = int(
        elapsed_seconds // (HEART_REGENERATION_MINUTES * 60)
    )

    if regenerated <= 0:
        return user.hearts

    new_hearts = min(
        MAX_HEARTS,
        user.hearts + regenerated,
    )

    user.hearts = new_hearts

    if new_hearts >= MAX_HEARTS:
        user.last_heart_lost_at = None
    else:
        user.last_heart_lost_at = (
            user.last_heart_lost_at
            + timedelta(
                minutes=regenerated * HEART_REGENERATION_MINUTES
            )
        )

    db.commit()
    db.refresh(user)

    return user.hearts


def lose_heart(db: Session, user: User) -> int:
    """
    Remove one heart from the user.
    """

    current_hearts = get_current_hearts(db, user)

    if current_hearts <= 0:
        return 0

    user.hearts -= 1
    user.last_heart_lost_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    return user.hearts


def add_xp(db: Session, user: User, amount: int) -> int:
    """
    Add XP to the user's total.
    """

    user.xp += amount

    db.commit()
    db.refresh(user)

    return user.xp


def award_conversation_xp(
    db: Session,
    user: User,
    had_mistake: bool,
) -> int:
    """
    Award XP when a conversation is completed.

    Normal completion: 50 XP
    Perfect completion: 75 XP
    """

    xp_earned = COMPLETION_XP

    if not had_mistake:
        xp_earned += PERFECT_BONUS_XP

    add_xp(
        db,
        user,
        xp_earned,
    )

    return xp_earned