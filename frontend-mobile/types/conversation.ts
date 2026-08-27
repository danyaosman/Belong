export type ConversationStatus =
  | "active"
  | "completed"
  | "abandoned";

export interface Conversation {
  id: number;
  lesson_id: number;
  character_id: number;
  character_avatar_url: string | null;
  current_step: number;
  status: ConversationStatus;
  started_at: string;
  ended_at: string | null;
  first_message: string;
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  sender: "user" | "character" | "system";
  message: string;
  created_at: string;
}

export interface ConversationTurn {
  correct: boolean;
  message: string;
  hint: string | null;
  current_step: number;
  completed: boolean;
}