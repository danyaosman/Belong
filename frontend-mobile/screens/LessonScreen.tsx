import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ExerciseRenderer from "../components/exercises/ExerciseRenderer";
import { getLesson, getLessonConversation } from "../services/lessonService";
import { COLORS } from "../theme/colors";
import { Lesson, ConversationContent } from "../types/lesson";

interface LessonScreenProps {
  lessonId: number;
  onBack: () => void;
  onStartConversation: () => void;
}

export default function LessonScreen({
  lessonId,
  onBack,
  onStartConversation,
}: LessonScreenProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [conversation, setConversation] =
  useState<ConversationContent | null>(null);
  
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [section, setSection] = useState<
    "learn" | "exercises"
  >("learn");

  const [currentExercise, setCurrentExercise] = useState(0);

  const [answered, setAnswered] = useState(false);

  const [correct, setCorrect] = useState(false);

  const [completed, setCompleted] = useState(false);

  const progressAnimation = useState(
    new Animated.Value(0)
  )[0];

  const feedbackAnimation = useState(
    new Animated.Value(0)
  )[0];

  // Load lesson from backend
  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);

        const [lessonData, conversationData] = await Promise.all([
          getLesson(lessonId),
          getLessonConversation(lessonId),
        ]);

        setLesson(lessonData);
        setConversation(conversationData);
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError("Unable to load lesson.");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  // Don't access lesson until it has loaded
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>
            Loading lesson...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            {error ?? "Lesson not found."}
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const exercise = lesson.exercises[currentExercise];

  const handleAnswer = (isCorrect: boolean) => {
    setCorrect(isCorrect);
    setAnswered(true);

    const completedExercises = currentExercise + 1;

    const targetProgress =
      (completedExercises / lesson.exercises.length) *
      100;

    Animated.timing(progressAnimation, {
      toValue: targetProgress,
      duration: 700,
      useNativeDriver: false,
    }).start();

    feedbackAnimation.setValue(0);

    Animated.spring(feedbackAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();
  };

  const handleContinue = () => {
    if (
      currentExercise ===
      lesson.exercises.length - 1
    ) {
      setCompleted(true);
      return;
    }

    setCurrentExercise(
      (previous) => previous + 1
    );

    setAnswered(false);
    setCorrect(false);

    feedbackAnimation.setValue(0);
  };

  /*
   * Completion screen
   */
  if (completed) {
    return (
      <View style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionIcon}>
            🎉
          </Text>

          <Text style={styles.completionTitle}>
            Lesson Complete!
          </Text>

          <Text style={styles.completionDescription}>
            Great job! You completed all the exercises
            in {lesson.title}.
          </Text>

          <TouchableOpacity
            style={styles.conversationButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text
              style={styles.conversationButtonText}
            >
              Back to Lessons
            </Text>

            <Text style={styles.conversationArrow}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ========================== */}
      {/* HEADER */}
      {/* ========================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {section === "learn"
            ? `Lesson ${lesson.lesson_number}`
            : "Practice"}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* ========================== */}
      {/* LEARNING SECTION */}
      {/* ========================== */}

      {section === "learn" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.learnContent
          }
        >
          {/* Introduction */}

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

          {/* Vocabulary */}

          <Text style={styles.sectionTitle}>
            Vocabulary
          </Text>

          {lesson.vocabulary.map(
            (word, index) => (
              <View
                key={index}
                style={styles.vocabularyCard}
              >
                <View style={styles.wordMain}>
                  <Text style={styles.turkish}>
                    {word.turkish}
                  </Text>

                  <Text
                    style={styles.pronunciation}
                  >
                    {word.pronunciation}
                  </Text>
                </View>

                <View
                  style={
                    styles.translationContainer
                  }
                >
                  <Text style={styles.english}>
                    {word.english}
                  </Text>

                  <Text style={styles.arabic}>
                    {word.arabic}
                  </Text>
                </View>
              </View>
            )
          )}

          {/* Grammar */}

          <Text style={styles.sectionTitle}>
            Grammar
          </Text>

          {lesson.grammar.map(
            (item, index) => (
              <View
                key={index}
                style={styles.grammarCard}
              >
                <Text style={styles.grammarTitle}>
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.grammarExplanation
                  }
                >
                  {item.explanation}
                </Text>

                <Text
                  style={styles.grammarExample}
                >
                  {item.example}
                </Text>

                <Text
                  style={
                    styles.grammarTranslation
                  }
                >
                  {item.translation}
                </Text>
              </View>
            )
          )}

          {/* Conversation Preview */}

          {conversation && (
          <View style={styles.conversationCard}>
            <Text style={styles.conversationTitle}>
              Conversation
            </Text>
        
            <Text style={styles.conversationLabel}>
              CONTEXT
            </Text>
        
            <Text style={styles.conversationContext}>
              {conversation.context}
            </Text>
        
            <Text style={styles.conversationLabel}>
              GOAL
            </Text>
        
            <Text style={styles.conversationGoal}>
              {conversation.goal}
            </Text>
        
            <Text style={styles.conversationLabel}>
              YOU WILL PRACTICE
            </Text>
        
            {conversation.success_criteria.map(
              (item, index) => (
                <Text
                  key={index}
                  style={styles.successCriteria}
                >
                  • {item}
                </Text>
              )
            )}
            <TouchableOpacity
              style={styles.startConversationButton}
              onPress={onStartConversation}
            >
              <Text style={styles.startConversationText}>
                START CONVERSATION
              </Text>
            </TouchableOpacity>
          </View>
        )}


          {/* Start Exercises */}

          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              setSection("exercises")
            }
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>
              Start Exercises
            </Text>

            <Text style={styles.startButtonArrow}>
              →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ========================== */}
      {/* EXERCISES */}
      {/* ========================== */}

      {section === "exercises" && (
        <View style={styles.exerciseScreen}>
          {/* Progress */}

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      progressAnimation.interpolate(
                        {
                          inputRange: [0, 100],
                          outputRange: [
                            "0%",
                            "100%",
                          ],
                        }
                      ),
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {currentExercise +
                (answered ? 1 : 0)}{" "}
              / {lesson.exercises.length}
            </Text>
          </View>

          {/* Exercise */}

          <View style={styles.exerciseContent}>
            <Text style={styles.exerciseLabel}>
              PRACTICE
            </Text>

            <Text style={styles.exerciseCount}>
              Question {currentExercise + 1} of{" "}
              {lesson.exercises.length}
            </Text>

            <View
              style={styles.exerciseCard}
            >
              <ExerciseRenderer
                exercise={exercise}
                onAnswered={handleAnswer}
              />
            </View>
          </View>

          {/* Feedback */}

          {answered && (
            <Animated.View
              style={[
                styles.feedback,
                correct
                  ? styles.correctFeedback
                  : styles.incorrectFeedback,
                {
                  transform: [
                    {
                      translateY:
                        feedbackAnimation.interpolate(
                          {
                            inputRange: [0, 1],
                            outputRange: [
                              180,
                              0,
                            ],
                          }
                        ),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {correct
                  ? "✓ Correct!"
                  : "✗ Not quite"}
              </Text>

              <Text style={styles.feedbackText}>
                {exercise.explanation}
              </Text>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text
                  style={styles.continueText}
                >
                  {currentExercise ===
                  lesson.exercises.length - 1
                    ? "Finish Lesson"
                    : "Continue"}
                </Text>

                <Text
                  style={styles.continueArrow}
                >
                  →
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  /* ========================== */
  /* HEADER */
  /* ========================== */

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
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

  /* ========================== */
  /* LEARNING */
  /* ========================== */

  learnContent: {
    paddingBottom: 10,
  },

  introduction: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  backButtonText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "800",
  },

  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  sectionTitle: {
    color: COLORS.cream,
    fontSize: 22,
    fontWeight: "900",
    marginHorizontal: 24,
    marginTop: 5,
    marginBottom: 10,
  },

  /* ========================== */
  /* VOCABULARY */
  /* ========================== */

  vocabularyCard: {
    marginHorizontal: 24,
    marginBottom: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: COLORS.ivory,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  wordMain: {
    flex: 1,
  },

  turkish: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "900",
  },

  pronunciation: {
    color: COLORS.brown,
    fontSize: 12,
    marginTop: 3,
  },

  translationContainer: {
    alignItems: "flex-end",
  },

  english: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "700",
  },

  arabic: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 3,
  },

  /* ========================== */
  /* GRAMMAR */
  /* ========================== */

  grammarCard: {
    marginHorizontal: 24,
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.ivory,
  },

  grammarTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
  },

  grammarExplanation: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  grammarExample: {
    color: COLORS.brown,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },

  grammarTranslation: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },

  /* ========================== */
  /* CONVERSATION PREVIEW */
  /* ========================== */

  conversationTitle: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  conversationCard: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.navy,
  },
  
  conversationLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  
  conversationContext: {
    color: COLORS.cream,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  
  conversationGoal: {
    color: COLORS.cream,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  
  successCriteria: {
    color: COLORS.cream,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 2,
  },

  startConversationButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  
  startConversationText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  
    /* ========================== */
    /* START EXERCISES */
    /* ========================== */

  startButton: {
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 15,
    minHeight: 62,
    borderRadius: 20,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  startButtonText: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: "900",
  },

  startButtonArrow: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: "800",
  },

  /* ========================== */
  /* EXERCISES */
  /* ========================== */

  exerciseScreen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
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

  exerciseContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  exerciseLabel: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  exerciseCount: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 14,
  },

  exerciseCard: {
    backgroundColor: COLORS.ivory,
    borderRadius: 22,
    padding: 20,
  },

  /* ========================== */
  /* FEEDBACK */
  /* ========================== */

  feedback: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  correctFeedback: {
    backgroundColor: COLORS.sage,
  },

  incorrectFeedback: {
    backgroundColor: COLORS.error,
  },

  feedbackTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "900",
  },

  feedbackText: {
    color: COLORS.navy,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  continueButton: {
    marginTop: 20,
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  continueText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "900",
  },

  continueArrow: {
    color: COLORS.gold,
    fontSize: 25,
    fontWeight: "800",
  },

  /* ========================== */
  /* COMPLETION */
  /* ========================== */

  completionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  completionIcon: {
    fontSize: 64,
    marginBottom: 20,
  },

  completionTitle: {
    color: COLORS.navy,
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  completionDescription: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 30,
  },

  conversationButton: {
    width: "100%",
    minHeight: 62,
    borderRadius: 20,
    backgroundColor: COLORS.brown,
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