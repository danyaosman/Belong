import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { Exercise } from "../../types/lesson";

type Props = {
  exercise: Exercise;
  onAnswered?: (correct: boolean) => void;
};

export default function TranslationQuestion({
  exercise,
  onAnswered,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) {
      return;
    }

    setSelectedIndex(index);

    onAnswered?.(exercise.options[index].is_correct);
  };

  return (
    <View>
      <Text style={styles.label}>TRANSLATE</Text>

      <Text style={styles.question}>
        {exercise.question}
      </Text>

      <View style={styles.options}>
        {exercise.options.map((option, index) => {
          const selected = selectedIndex === index;

          let backgroundColor = COLORS.ivory;
          let borderColor = COLORS.sage;
          let textColor = COLORS.navy;

          if (selected) {
            if (option.is_correct) {
              backgroundColor = COLORS.success;
              borderColor = COLORS.success;
              textColor = COLORS.white;
            } else {
              backgroundColor = COLORS.error;
              borderColor = COLORS.error;
              textColor = COLORS.white;
            }
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(index)}
              style={[
                styles.option,
                {
                  backgroundColor,
                  borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: textColor },
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedIndex !== null && (
        <Text style={styles.explanation}>
          {exercise.explanation}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },

  question: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 29,
    marginBottom: 22,
  },

  options: {
    gap: 12,
  },

  option: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "700",
  },

  explanation: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
  },
});