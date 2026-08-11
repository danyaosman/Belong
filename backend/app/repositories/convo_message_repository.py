from sqlalchemy.orm import Session

from app.models.conversation_message import ConversationMessage


class ConversationMessageRepository:

    def create(
        self,
        db: Session,
        message: ConversationMessage,
    ):
        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    def get_by_conversation(
        self,
        db: Session,
        conversation_id: int,
    ):
        return (
            db.query(ConversationMessage)
            .filter(
                ConversationMessage.conversation_id == conversation_id
            )
            .order_by(
                ConversationMessage.created_at.asc()
            )
            .all()
        )


conversation_message_repository = ConversationMessageRepository()