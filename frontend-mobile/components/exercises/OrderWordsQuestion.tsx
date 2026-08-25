import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { Exercise, ExerciseOption } from "../../types/lesson";

interface OrderWordsQuestionProps {
  exercise: Exercise;
  onAnswered?: (correct: boolean) => void;
}

export default function OrderWordsQuestion({
  exercise,
  onAnswered,
}: OrderWordsQuestionProps) {
  const [selectedWords, setSelectedWords] = useState<ExerciseOption[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const shuffledOptions = useMemo(() => {
    return [...exercise.options].sort(() => Math.random() - 0.5);
  }, [exercise.options]);

  const availableOptions = shuffledOptions.filter(
    (option) =>
      !selectedWords.some(
        (selected, index) =>
          selected.text === option.text &&
          selectedOptionsIndex(selected, selectedWords) === index
      )
  );

  function selectedOptionsIndex(
    option: ExerciseOption,
    options: ExerciseOption[]
  ) {
    return options.indexOf(option);
  }

  function selectWord(option: ExerciseOption) {
    if (submitted) return;

    setSelectedWords((current) => [...current, option]);
  }

  function removeWord(index: number) {
    if (submitted) return;

    setSelectedWords((current) =>
      current.filter((_, wordIndex) => wordIndex !== index)
    );
  }

  function checkAnswer() {
    if (selectedWords.length === 0 || submitted) return;

    const correctOrder = [...exercise.options]
      .filter((option) => option.order_index !== undefined)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    const isCorrect =
      selectedWords.length === correctOrder.length &&
      selectedWords.every(
        (word, index) => word.text === correctOrder[index].text
      );

    setSubmitted(true);
    onAnswered?.(isCorrect);
  }

  const isComplete =
    selectedWords.length ===
    exercise.options.filter(
      (option) => option.order_index !== undefined
    ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <Text style={styles.instruction}>
        Tap the words in the correct order.
      </Text>

      {/* Sentence area */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.answerArea}
        onPress={() => {}}
      >
        {selectedWords.length === 0 ? (
          <Text style={styles.placeholder}>
            Your sentence will appear here
          </Text>
        ) : (
          selectedWords.map((word, index) => (
            <TouchableOpacity
              key={`${word.text}-${index}`}
              onPress={() => removeWord(index)}
              style={styles.selectedWord}
            >
              <Text style={styles.selectedWordText}>{word.text}</Text>
            </TouchableOpacity>
          ))
        )}
      </TouchableOpacity>

      {/* Word choices */}
      <View style={styles.wordOptions}>
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedWords.includes(option);

          if (isSelected) {
            return null;
          }

          return (
            <TouchableOpacity
              key={`${option.text}-${index}`}
              style={styles.wordButton}
              onPress={() => selectWord(option)}
              disabled={submitted}
            >
              <Text style={styles.wordButtonText}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Check button */}
      <TouchableOpacity
        style={[
          styles.checkButton,
          !isComplete && styles.checkButtonDisabled,
        ]}
        onPress={checkAnswer}
        disabled={!isComplete || submitted}
      >
        <Text style={styles.checkButtonText}>Check</Text>
      </TouchableOpacity>

      {submitted && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanation}>
            {exercise.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  question: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 10,
  },

  instruction: {
    fontSize: 15,
    color: COLORS.brown,
    marginBottom: 18,
  },

  answerArea: {
    minHeight: 90,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.navy,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 12,
  },

  placeholder: {
    fontSize: 16,
    color: COLORS.gray,
  },

  selectedWord: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },

  selectedWordText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.navy,
  },

  wordOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 24,
  },

  wordButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.brown,
  },

  wordButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.navy,
  },

  checkButton: {
    marginTop: 28,
    backgroundColor: COLORS.navy,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  checkButtonDisabled: {
    opacity: 0.4,
  },

  checkButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },

  explanationContainer: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.sage,
  },

  explanation: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.navy,
  },
});