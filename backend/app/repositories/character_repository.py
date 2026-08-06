from sqlalchemy.orm import Session

from app.models.character import Character


class CharacterRepository:

    def get_all(
        self,
        db: Session,
    ):
        return db.query(Character).all()

    def get_by_id(
        self,
        db: Session,
        character_id: int,
    ):
        return (
            db.query(Character)
            .filter(Character.id == character_id)
            .first()
        )

    def get_by_name(
        self,
        db: Session,
        character_name: str,
    ):
        return (
            db.query(Character)
            .filter(Character.name == character_name)
            .first()
        )
