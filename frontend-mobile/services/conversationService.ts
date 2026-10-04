import {
  Conversation,
  ConversationMessage,
  ConversationTurn,
} from "../types/conversation";

import { apiRequest } from "../types/api";

export async function startConversation(
  lessonId: number,
  token: string
): Promise<Conversation> {
  return apiRequest<Conversation>(
    "/conversations/start",
    {
      method: "POST",
      body: JSON.stringify({
        lesson_id: lessonId,
      }),
    },
    token
  );
}

export async function sendConversationMessage(
  conversationId: number,
  message: string,
  token: string
): Promise<ConversationTurn> {
  return apiRequest<ConversationTurn>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
      }),
    },
    token
  );
}

export async function getConversationMessages(
  conversationId: number,
  token: string
): Promise<ConversationMessage[]> {
  return apiRequest<ConversationMessage[]>(
    `/conversations/${conversationId}/messages`,
    {
      method: "GET",
    },
    token
  );
}

export async function getConversation(
  conversationId: number,
  token: string
): Promise<Conversation> {
  return apiRequest<Conversation>(
    `/conversations/${conversationId}`,
    {
      method: "GET",
    },
    token
  );
}

export async function getConversations(
  token: string
): Promise<Conversation[]> {
  return apiRequest<Conversation[]>(
    "/conversations",
    {
      method: "GET",
    },
    token
  );
}