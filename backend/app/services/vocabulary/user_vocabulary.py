from sqlalchemy.orm import Session

from app.models.user_vocabulary import UserVocabulary
from app.repositories.user_vocabulary_repository import (
    user_vocabulary_repository,
)


def get_user_vocabulary(
    db: Session,
    user_id: int,
):
    entries = (
        user_vocabulary_repository.get_by_user(
            db,
            user_id,
        )
    )

    return [
        {
            "id": entry.id,
            "vocabulary_id": entry.vocabulary_id,
            "turkish": entry.vocabulary.turkish,
            "english": entry.vocabulary.english,
            "arabic": entry.vocabulary.arabic,
            "pronunciation": entry.vocabulary.pronunciation,
            "example_sentence": entry.vocabulary.example_sentence,
            "example_translation": entry.vocabulary.example_translation,
            "learned_at": entry.learned_at,
        }
        for entry in entries
    ]


def add_lesson_vocabulary(
    db: Session,
    user_id: int,
    vocabulary_items,
):
    for vocabulary in vocabulary_items:

        exists = user_vocabulary_repository.exists(
            db,
            user_id,
            vocabulary.id,
        )

        if exists:
            continue

        user_vocabulary_repository.create(
            db,
            UserVocabulary(
                user_id=user_id,
                vocabulary_id=vocabulary.id,
            ),
        )