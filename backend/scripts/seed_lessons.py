import json
from pathlib import Path

from app.db.session import SessionLocal
from app.models.lesson import Lesson
from app.models.vocabulary import Vocabulary
from app.models.grammar import Grammar
from app.models.exercise import Exercise
from app.models.exercise_option import ExerciseOption


DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "lessons"


def seed_lesson(json_file: Path, db):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Skip if lesson already exists
    existing = (
        db.query(Lesson)
        .filter(
            Lesson.level == data["level"],
            Lesson.lesson_number == data["lesson_number"],
        )
        .first()
    )

    if existing:
        print(
            f"Skipping Level {data['level']} Lesson {data['lesson_number']} (already exists)"
        )
        return

    lesson = Lesson(
        title=data["title"],
        description=data["description"],
        level=data["level"],
        lesson_number=data["lesson_number"],
        conversation_context=data["conversation"]["context"],
        conversation_goal=data["conversation"]["goal"],
        success_criteria=data["conversation"]["success_criteria"],
        thumbnail_url=data.get("thumbnail_url"),
        character_id=data["character_id"]
    )

    db.add(lesson)
    db.flush()

    # ---------------- Vocabulary ----------------

    for word in data["vocabulary"]:

        vocabulary = Vocabulary(
            lesson_id=lesson.id,
            turkish=word["turkish"],
            english=word["english"],
            arabic=word["arabic"],
            pronunciation=word.get("pronunciation"),
            example_sentence=word.get("example_sentence"),
            example_translation=word.get("example_translation"),
            audio_url=word.get("audio_url"),
        )

        db.add(vocabulary)

    # ---------------- Grammar ----------------

    for grammar in data["grammar"]:

        grammar_point = Grammar(
            lesson_id=lesson.id,
            title=grammar["title"],
            explanation=grammar["explanation"],
            example=grammar["example"],
            translation=grammar["translation"],
        )

        db.add(grammar_point)

    # ---------------- Exercises ----------------

    for exercise_data in data["exercises"]:

        exercise = Exercise(
            lesson_id=lesson.id,
            type=exercise_data["type"],
            question=exercise_data["question"],
            explanation=exercise_data.get("explanation"),
        )

        db.add(exercise)
        db.flush()

        for option_data in exercise_data["options"]:

            option = ExerciseOption(
                exercise_id=exercise.id,
                text=option_data["text"],
                is_correct=option_data["is_correct"],
                order_index=option_data.get("order_index"),
            )

            db.add(option)

    db.commit()

    print(
        f"Seeded Level {lesson.level} Lesson {lesson.lesson_number}"
    )


def main():

    db = SessionLocal()

    try:

        for level_folder in sorted(DATA_DIR.iterdir()):

            if not level_folder.is_dir():
                continue

            for lesson_file in sorted(level_folder.glob("*.json")):
                seed_lesson(lesson_file, db)

    finally:
        db.close()


if __name__ == "__main__":
    main()