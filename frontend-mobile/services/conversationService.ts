import { ConversationContent } from "../types/lesson";

const API_URL =
  "https://spectrum-resize-nerd.ngrok-free.app";

export async function getLessonConversation(
  lessonId: number
): Promise<ConversationContent> {
  const response = await fetch(
    `${API_URL}/lessons/${lessonId}/conversation`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load conversation: ${response.status}`
    );
  }

  return response.json();
}