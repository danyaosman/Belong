from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

from app.models.user import User
from app.models.lesson import Lesson
from app.models.vocabulary import Vocabulary
from app.models.grammar import Grammar
from app.models.exercise import Exercise
from app.models.exercise_option import ExerciseOption
from app.models.character import Character
from app.models.conversation import Conversation
from app.models.conversation_message import ConversationMessage
