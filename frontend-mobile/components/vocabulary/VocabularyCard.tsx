import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { VocabularyItem } from "../../types/lesson";

interface VocabularyCardProps {
  vocabulary: VocabularyItem;
  left: number;
  top: number;
  onClose: () => void;
}

export default function VocabularyCard({
  vocabulary,
  left,
  top,
  onClose,
}: VocabularyCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      style={[
        styles.card,
        {
          left,
          top,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>
            {vocabulary.turkish}
          </Text>

          <Text style={styles.pronunciation}>
            {vocabulary.pronunciation}
          </Text>
        </View>

        <Text style={styles.close}>×</Text>
      </View>

      <Text style={styles.english}>
        {vocabulary.english}
      </Text>

      {vocabulary.arabic && (
        <Text style={styles.arabic}>
          {vocabulary.arabic}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: 220,
    backgroundColor: COLORS.ivory,
    borderRadius: 18,
    padding: 16,

    borderWidth: 2,
    borderColor: COLORS.sage,

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 8,

    zIndex: 1000,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  wordContainer: {
    flex: 1,
  },

  word: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "900",
  },

  pronunciation: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  english: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },

  arabic: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 4,
  },

  close: {
    color: COLORS.muted,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
});