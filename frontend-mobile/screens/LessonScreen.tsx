import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ExerciseRenderer from "../components/exercises/ExerciseRenderer";
import { COLORS } from "../theme/colors";
import { Exercise, Lesson } from "../types/lesson";

const lesson: Lesson = {
  title: "Greetings",
  description:
    "Learn how to greet people, introduce yourself and say goodbye in Turkish.",
  level: 1,
  lesson_number: 1,
  character_id: 1, 
  conversation: {
    "context": "You meet Dilara at university in Istanbul for the first time.",
    "goal": "Introduce yourself and have a short first conversation.",
    "success_criteria": [
      "Greet Dilara and introduce yourself",
      "Say where you are from",
      "Talk about what you study",
      "Talk about your hobbies",
      "Say goodbye politely"
    ],

    "steps": [
      {
        "id": 1,
        "character_message": "Merhaba! Ben Dilara. Senin adın ne?",        "target_phrases": [
          "Merhaba",
          "Benim adım ...",
          "Ben ..."
        ],
        "hint": "You can say: Merhaba! Benim adım..",
      },
      {
        "id": 2,
        "character_message": "Memnun oldum! Nerelisin?",
        "target_phrases": [
          "Ben ...'danım",
          "Ben ...'denim",
          "Ben ...liyim"
        ],
        "hint": "You can say: Ben İstanbul'danım.",
      },
      {
        "id": 3,
        "character_message": "Ben de İstanbul'da üniversite okuyorum. Sen ne okuyorsun?",
        "target_phrases": [
          "Ben öğrenciyim",
          "Ben yazılım okuyorum",
          "Üniversitede okuyorum"
        ],
        "hint": "You can say: Üniversitede okuyorum.",
      },
      {
        "id": 4,
        "character_message": "Anladım! Peki, hobilerin neler?",
        "target_phrases": [
          "Kitap okumayı seviyorum",
          "Müzik dinlemeyi seviyorum",
          "Film izlemeyi seviyorum"
        ],
        "hint": "You can say: Müzik dinlemeyi seviyorum.",
      },
      {
        "id": 5,
        "character_message": "Seninle tanıştığıma memnun oldum! Görüşürüz!",
        "target_phrases": [
          "Görüşürüz",
          "Hoşça kal",
          "Güle güle"
        ],
        "hint": "You can say: Görüşürüz!",
      }
    ]
  },
  vocabulary: [
    {
      turkish: "Merhaba",
      english: "Hello",
      arabic: "مرحباً",
      pronunciation: "mehr-ha-bah",
      example_sentence: "Merhaba, ben Ahmet.",
      example_translation: "Hello, I'm Ahmet.",
    },
    {
      turkish: "Ben",
      english: "I am",
      arabic: "أنا",
      pronunciation: "ben",
      example_sentence: "Ben Dilara.",
      example_translation: "I am Dilara.",
    },
  ],

  grammar: [
    {
      title: "Introducing yourself",
      explanation:
        "Use 'Ben' or 'Adım' to introduce yourself.",
      example: "Ben Ali. / Adım Ali.",
      translation: "I am Ali. / My name is Ali.",
    },
  ],

  exercises: [
    {
      type: "multiple_choice",
      question: "How do you say 'Hello' in Turkish?",
      explanation:
        "Merhaba is the most common greeting.",
      options: [
        {
          text: "Merhaba",
          is_correct: true,
        },
        {
          text: "Hoşça kal",
          is_correct: false,
        },
        {
          text: "Teşekkür ederim",
          is_correct: false,
        },
        {
          text: "Lütfen",
          is_correct: false,
        },
      ],
    },

    {
      type: "translation",
      question: "Translate: My name is Ali.",
      explanation:
        "Use 'Adım' when introducing yourself.",
      options: [
        {
          text: "Adım Ali.",
          is_correct: true,
        },
        {
          text: "Ben Ali.",
          is_correct: true,
        },
      ],
    },

    {
      type: "order_words",
      question:
        "Arrange the words to introduce yourself.",
      explanation:
        "Place the words in the correct order.",
      options: [
        {
          text: "Ben",
          is_correct: true,
          order_index: 1,
        },
        {
          text: "Ali",
          is_correct: true,
          order_index: 2,
        },
      ],
    },
  ],
};

export default function LessonScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Lesson {lesson.lesson_number}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Lesson introduction */}
        <View style={styles.introduction}>
          <Text style={styles.level}>
            LEVEL {lesson.level}
          </Text>

          <Text style={styles.title}>
            {lesson.title}
          </Text>

          <Text style={styles.description}>
            {lesson.description}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${100 / lesson.exercises.length}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            0 / {lesson.exercises.length}
          </Text>
        </View>

        {/* Vocabulary */}
        <Text style={styles.sectionTitle}>
          Vocabulary
        </Text>

        <View style={styles.vocabularyCard}>
          {lesson.vocabulary.map((word, index) => (
            <View
              key={word.turkish}
              style={[
                styles.vocabularyRow,
                index !== lesson.vocabulary.length - 1 &&
                  styles.vocabularyBorder,
              ]}
            >
              <View>
                <Text style={styles.turkish}>
                  {word.turkish}
                </Text>

                <Text style={styles.pronunciation}>
                  {word.pronunciation}
                </Text>
              </View>

              <Text style={styles.english}>
                {word.english}
              </Text>
            </View>
          ))}
        </View>

        {/* Grammar */}
        <Text style={styles.sectionTitle}>
          Grammar
        </Text>

        {lesson.grammar.map((grammar) => (
          <View
            key={grammar.title}
            style={styles.grammarCard}
          >
            <Text style={styles.grammarTitle}>
              {grammar.title}
            </Text>

            <Text style={styles.grammarExplanation}>
              {grammar.explanation}
            </Text>

            <Text style={styles.grammarExample}>
              {grammar.example}
            </Text>

            <Text style={styles.grammarTranslation}>
              {grammar.translation}
            </Text>
          </View>
        ))}

        {/* Exercises */}
        <Text style={styles.sectionTitle}>
          Practice
        </Text>

        {lesson.exercises.map(
          (exercise: Exercise, index) => (
            <View
              key={index}
              style={styles.exerciseCard}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>
                  {index + 1}
                </Text>
              </View>

              <ExerciseRenderer
                exercise={exercise}
              />
            </View>
          ),
        )}

        {/* Start conversation */}
        <TouchableOpacity style={styles.conversationButton}>
          <Text style={styles.conversationButtonText}>
            Start Conversation
          </Text>

          <Text style={styles.conversationArrow}>
            →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: COLORS.navy,
    fontSize: 34,
    lineHeight: 36,
  },

  headerTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 42,
  },

  introduction: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  level: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  title: {
    color: COLORS.navy,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },

  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: COLORS.sage,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.brown,
    borderRadius: 10,
  },

  progressText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "800",
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 12,
  },

  vocabularyCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.ivory,
    borderRadius: 20,
    paddingHorizontal: 18,
  },

  vocabularyRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  vocabularyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sage,
  },

  turkish: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "800",
  },

  pronunciation: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },

  english: {
    color: COLORS.brown,
    fontSize: 14,
    fontWeight: "700",
  },

  grammarCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.sage,
    borderRadius: 20,
    padding: 18,
  },

  grammarTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "900",
  },

  grammarExplanation: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  grammarExample: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },

  grammarTranslation: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 3,
  },

  exerciseCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: COLORS.ivory,
    borderRadius: 22,
    padding: 20,
  },

  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  exerciseNumberText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: "900",
  },

  conversationButton: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: COLORS.navy,
    minHeight: 62,
    borderRadius: 20,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  conversationButtonText: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: "900",
  },

  conversationArrow: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: "800",
  },
});