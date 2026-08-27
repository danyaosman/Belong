from typing import Any
import re

def evaluate_response(
        user_message: str,
        step: dict[str, Any],
) -> dict[str,Any]:
    message = user_message.lower().strip()

    target_phrases = step.get("target_phrases", [])

    for phrase in target_phrases:

        pattern = re.escape(
            phrase.lower().strip()
        ).replace(r"\.\.\.", ".*")

        if re.search(pattern, message):
            return {
                "correct": True,
                "needs_hint": False,
                "feedback": None,
                "hint": None,
            }

    return {
        "correct": False,
        "needs_hint": True,
        "feedback": "Almost! Try again.",
        "hint": step.get("hint"),
    }