export interface UserVocabulary {
  id: number;
  vocabulary_id: number;
  turkish: string;
  english: string;
  arabic: string;
  pronunciation: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  learned_at: string;
}