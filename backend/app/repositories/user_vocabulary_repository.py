from sqlalchemy.orm import Session, joinedload

from app.models.user_vocabulary import UserVocabulary


class UserVocabularyRepository:

    def get_by_user(
        self,
        db: Session,
        user_id: int,
    ):
        return (
            db.query(UserVocabulary)
            .options(
                joinedload(
                    UserVocabulary.vocabulary
                )
            )
            .filter(
                UserVocabulary.user_id == user_id
            )
            .order_by(
                UserVocabulary.learned_at.desc()
            )
            .all()
        )

    def exists(
        self,
        db: Session,
        user_id: int,
        vocabulary_id: int,
    ) -> bool:
        return (
            db.query(UserVocabulary)
            .filter(
                UserVocabulary.user_id == user_id,
                UserVocabulary.vocabulary_id
                == vocabulary_id,
            )
            .first()
            is not None
        )

    def create(
        self,
        db: Session,
        user_vocabulary: UserVocabulary,
    ):
        db.add(user_vocabulary)

        return user_vocabulary


user_vocabulary_repository = (
    UserVocabularyRepository()
)