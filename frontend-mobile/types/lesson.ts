export type ExerciseType =
  | "multiple_choice"
  | "translation"
  | "order_words";

export interface ExerciseOption {
  text: string;
  is_correct: boolean;
  order_index?: number;
}

export interface Exercise {
  type: ExerciseType;
  question: string;
  explanation: string;
  options: ExerciseOption[];
}

export interface VocabularyItem {
  turkish: string;
  english: string;
  arabic: string;
  pronunciation: string;
  example_sentence: string;
  example_translation: string;
}

export interface GrammarItem {
  title: string;
  explanation: string;
  example: string;
  translation: string;
}

export interface ConversationStep {
  id: number;
  character_message: string;
  target_phrases: string[];
  hint: string;
}

export interface Lesson {
  title: string;
  description: string;
  level: number;
  lesson_number: number;
  character_id: number;
  conversation: {
    context: string;
    goal: string;
    success_criteria: string[];
    steps: ConversationStep[];
  };
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  exercises: Exercise[];
}