import React, {
  useRef,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { VocabularyItem } from "../../types/lesson";
import VocabularyCard from "./VocabularyCard";

interface InteractiveMessageProps {
  message: string;
  vocabulary: VocabularyItem[];
  textStyle?: any;
}

interface WordPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

function normalizeWord(word: string): string {
  return word
    .toLocaleLowerCase("tr-TR")
    .replace(
      /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,
      ""
    );
}

function isVocabularyWord(
  word: string,
  vocabulary: VocabularyItem[]
): VocabularyItem | undefined {
  const normalized = normalizeWord(word);

  return vocabulary.find(
    (item) =>
      normalizeWord(item.turkish) ===
      normalized
  );
}

export default function InteractiveMessage({
  message,
  vocabulary,
  textStyle,
}: InteractiveMessageProps) {
  const [selectedVocabulary, setSelectedVocabulary] =
    React.useState<VocabularyItem | null>(null);

  const [cardPosition, setCardPosition] =
    React.useState<WordPosition | null>(null);

  const wordRefs = useRef<
    Record<string, Text | null>
  >({});

  const screenWidth =
    Dimensions.get("window").width;

  /*
   * Split while preserving whitespace.
   *
   * Example:
   *
   * "Merhaba! Ben Dilara."
   *
   * becomes:
   *
   * ["Merhaba!", " ", "Ben", " ", "Dilara."]
   */
  const parts = message.split(/(\s+)/);

  const handleWordPress = (
    part: string,
    index: number,
    vocabularyItem: VocabularyItem
  ) => {
    const ref =
      wordRefs.current[
        `${index}-${part}`
      ];

    if (!ref) {
      return;
    }

    ref.measureInWindow(
      (x, y, width, height) => {
        const cardWidth = 220;

        let left =
          x + width / 2 - cardWidth / 2;

        /*
         * Keep the card inside the screen.
         */
        left = Math.max(
          12,
          Math.min(
            left,
            screenWidth -
              cardWidth -
              12
          )
        );

        /*
         * Put the card above the word.
         */
        let top = y - 145;

        /*
         * If there isn't enough room above,
         * place it below instead.
         */
        if (top < 12) {
          top = y + height + 10;
        }

        setCardPosition({
          left,
          top,
          width,
          height,
        });

        setSelectedVocabulary(
          vocabularyItem
        );
      }
    );
  };

  return (
    <View>
      <Text
        style={[
            {
                color: COLORS.text,
                fontSize: 16,
                lineHeight: 24,
        },
        textStyle,
        ]}
      >
        {parts.map((part, index) => {
          /*
           * Whitespace stays ordinary text.
           */
          if (/^\s+$/.test(part)) {
            return (
              <Text key={index}>
                {part}
              </Text>
            );
          }

          const vocabularyItem =
            isVocabularyWord(
              part,
              vocabulary
            );

          if (!vocabularyItem) {
            return (
              <Text key={index}>
                {part}
              </Text>
            );
          }

          const refKey =
            `${index}-${part}`;

          return (
            <Text
              key={index}
              ref={(ref) => {
                wordRefs.current[
                  refKey
                ] = ref;
              }}
              onPress={() =>
                handleWordPress(
                  part,
                  index,
                  vocabularyItem
                )
              }
              style={styles.vocabularyWord}
            >
              {part}
            </Text>
          );
        })}
      </Text>

      {selectedVocabulary &&
        cardPosition && (
          <VocabularyCard
            vocabulary={
              selectedVocabulary
            }
            left={cardPosition.left}
            top={cardPosition.top}
            onClose={() => {
              setSelectedVocabulary(
                null
              );
              setCardPosition(null);
            }}
          />
        )}
    </View>
  );
}

const styles = {
  vocabularyWord: {
    color: COLORS.navy,
    fontWeight: "600" as const,
    textDecorationLine:
      "underline" as const,
    textDecorationColor:
      COLORS.gold,
  },
};