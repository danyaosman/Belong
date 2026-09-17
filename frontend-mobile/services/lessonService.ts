import { Lesson, LessonContent, ConversationContent } from "../types/lesson";

const API_URL = 
"https://spectrum-resize-nerd.ngrok-free.dev";

export async function getLesson(
  lessonId: number
): Promise<LessonContent> {
  const response = await fetch(
    `${API_URL}/lessons/${lessonId}/content`
  );

  console.log("REQUESTING:");

  if (!response.ok) {
    throw new Error(
      `Failed to load lesson: ${response.status}`
    );
  }

  return response.json();
}

export async function getLessons(): Promise<Lesson[]> {
  const response = await fetch(
    `${API_URL}/lessons`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load lessons: ${response.status}`
    );
  }

  return response.json();
}

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