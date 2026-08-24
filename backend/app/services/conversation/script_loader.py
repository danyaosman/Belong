import json
from pathlib import Path


LESSONS_DIR = (
    Path(__file__).resolve().parents[3]
    / "data"
    / "lessons"
)


def load_lesson_script(
    level: int,
    lesson_number: int,
) -> dict:
    filepath = (
        LESSONS_DIR
        / f"level{level}"
        / f"lesson{lesson_number}.json"
    )

    if not filepath.exists():
        raise FileNotFoundError(
            f"Lesson script not found: {filepath}"
        )

    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)