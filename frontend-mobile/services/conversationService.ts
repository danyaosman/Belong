import {
  Conversation,
  ConversationTurn,
} from "../types/conversation";

const API_URL =
  "https://spectrum-resize-nerd.ngrok-free.dev";

export async function startConversation(
  lessonId: number
): Promise<Conversation> {

   console.log(
    "STARTING CONVERSATION FOR LESSON:",
    lessonId
  );

  const response = await fetch(
    `${API_URL}/conversations/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lesson_id: lessonId,
      }),
    }
  );

  console.log(
    "START CONVERSATION STATUS:",
    response.status
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.log(
      "START CONVERSATION ERROR:",
      errorText
    );

    throw new Error(
      `Failed to start conversation: ${response.status}`
    );
  }

  return response.json();
}

export async function sendConversationMessage(
  conversationId: number,
  message: string
): Promise<ConversationTurn> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to send message: ${response.status}`
    );
  }

  return response.json();
}