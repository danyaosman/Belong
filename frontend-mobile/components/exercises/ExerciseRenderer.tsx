import { Exercise } from "../../types/lesson";

import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TranslationQuestion from "./TranslationQuestion";
import OrderWordsQuestion from "./OrderWordsQuestion";

type Props = {
  exercise: Exercise;
  onAnswered?: (correct: boolean) => void;
};

export default function ExerciseRenderer({
  exercise,
  onAnswered,
}: Props) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          exercise={exercise}
          onAnswered={onAnswered}
        />
      );

    case "translation":
      return (
        <TranslationQuestion
          exercise={exercise}
          onAnswered={onAnswered}
        />
      );

    case "order_words":
      return (
        <OrderWordsQuestion
          exercise={exercise}
          onAnswered={onAnswered}
        />
      );

    default:
      return null;
  }
}