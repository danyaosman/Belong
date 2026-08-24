import json
from pathlib import Path

from app.db.session import SessionLocal
from app.models.character import Character
from app.repositories.character_repository import CharacterRepository

DATA_DIR = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "characters"
)

repository = CharacterRepository()


def seed_character(
    json_file: Path,
    db,
):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing = repository.get_by_name(
        db,
        data["name"],
    )

    if existing:
        print(f"Skipping {data['name']} (already exists)")
        return

    character = Character(
        name=data["name"],
        age=data["age"],
        occupation=data["occupation"],
        personality=data["personality"],
        background=data["background"],
        system_prompt=data["system_prompt"],
        avatar_url=data.get("avatar_url"),
        voice_id=data.get("voice_id"),
    )

    db.add(character)
    db.commit()
    db.refresh(character)

    print(f"Seeded {character.name}")


def main():
    db = SessionLocal()

    try:
        for json_file in sorted(DATA_DIR.glob("*.json")):
            seed_character(
                json_file,
                db,
            )
    finally:
        db.close()


if __name__ == "__main__":
    main()