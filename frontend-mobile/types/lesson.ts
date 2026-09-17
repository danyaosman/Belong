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

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: number;
  lesson_number: number;
  character_id: number;
}

export interface LessonContent extends Lesson {
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  exercises: Exercise[];
}

export interface ConversationStep {
  id: number;
  character_message: string;
  expected_intent: string;
  target_phrases: string[];
  hint: string;
  required: boolean;
}

export interface ConversationContent {
  context: string;
  goal: string;
  success_criteria: string[];
}