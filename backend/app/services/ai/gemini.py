from google import genai

from app.core.config import settings
from app.schemas.gemini import GeminiConversationResponse


MODEL_NAME = "gemini-3.5-flash-lite"


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def evaluate_conversation_response(
    *,
    character_name: str,
    character_personality: str,
    character_occupation: str,
    character_background: str,
    lesson_title: str,
    lesson_context: str,
    lesson_goal: str,
    success_criteria: list[str],
    current_step: dict,
    user_message: str,
    previous_interaction_id: str | None,
    initial_character_message: str,
):
    system_instruction = f"""
You are {character_name}, an AI character in the Belong
Turkish language-learning application.

You are participating in a structured Turkish language lesson.

CHARACTER INFORMATION
Name: {character_name}
Personality: {character_personality}
Occupation: {character_occupation}
Background: {character_background}

YOUR ROLE

You must behave as the character while also helping the learner
complete the lesson.

Stay in character.

Speak naturally and concisely in Turkish.

Do not behave like a generic chatbot.

Do not invent new lesson objectives.

Do not skip lesson steps.

Do not decide what the next lesson step number is.
The application backend controls lesson progression.

EVALUATION RULES

Evaluate the learner's response based on the CURRENT STEP.

Accept natural variations of a correct answer.

Do not require the learner to reproduce the exact target phrase
word-for-word if their Turkish communicates the intended meaning.

Minor spelling or grammatical mistakes may still be considered
acceptable when the intended answer is clear, unless the current
lesson step specifically requires that grammatical form.

If the answer is correct:
- correct must be true
- feedback should be null
- hint should be null
- provide a natural character response

If the answer is incorrect:
- correct must be false
- provide a short, helpful feedback message
- provide a useful hint
- character_message should naturally continue the conversation
  without giving away the complete answer

Keep responses appropriate for a Turkish learner.

LESSON

Title:
{lesson_title}

Context:
{lesson_context}

Goal:
{lesson_goal}

Success criteria:
{success_criteria}

CURRENT STEP

{current_step}

The character's first message in this conversation was:

{initial_character_message}
"""

    if previous_interaction_id:
        interaction = client.interactions.create(
            model=MODEL_NAME,
            previous_interaction_id=previous_interaction_id,
            input=user_message,
            system_instruction=system_instruction,
            generation_config={
                "thinking_level": "low",
            },
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": GeminiConversationResponse.model_json_schema(),
            },
        )

    else:
        first_turn_context = f"""
The conversation has just started.

The character has already said:

"{initial_character_message}"

The learner now responds:

"{user_message}"

Evaluate the learner's response according to the current lesson step.
"""

        interaction = client.interactions.create(
            model=MODEL_NAME,
            input=first_turn_context,
            system_instruction=system_instruction,
            generation_config={
                "thinking_level": "low",
            },
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": GeminiConversationResponse.model_json_schema(),
            },
        )

    if not interaction.output_text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    result = GeminiConversationResponse.model_validate_json(
        interaction.output_text
    )

    return result, interaction.id