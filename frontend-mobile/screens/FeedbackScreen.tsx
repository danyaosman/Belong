import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../theme/colors";

type FeedbackScreenProps = {
  navigation: any;
  route: {
    params: {
      lessonId: number;
      conversationId: number;
      totalSteps: number;
      correctResponses: number;
      hintsUsed: number;
      vocabularyCount: number;
      grammarCount: number;
    };
  };
};

export default function FeedbackScreen({
  navigation,
  route,
}: FeedbackScreenProps) {
  const {
    totalSteps,
    correctResponses,
    hintsUsed,
    vocabularyCount,
    grammarCount,
  } = route.params;

  const handleContinue = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Completion */}
        <View style={styles.hero}>
          <View style={styles.celebrationCircle}>
            <Text style={styles.celebrationIcon}>✓</Text>
          </View>

          <Text style={styles.completionLabel}>LESSON COMPLETE</Text>

          <Text style={styles.title}>Great job!</Text>

          <Text style={styles.subtitle}>
            You completed the conversation.
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressPercentage}>100%</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressText}>Lesson completed</Text>
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR PERFORMANCE</Text>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Conversation</Text>
              <Text style={styles.performanceValue}>
                {totalSteps} {totalSteps === 1 ? "turn" : "turns"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Correct</Text>
              <Text style={styles.performanceValue}>
                {correctResponses}/{totalSteps}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Hints used</Text>
              <Text style={styles.performanceValue}>{hintsUsed}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Speaking</Text>

              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* What you learned */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHAT YOU LEARNED</Text>

          <View style={styles.learningCard}>
            <View style={styles.learningRow}>
              <View>
                <Text style={styles.learningTitle}>Vocabulary</Text>
                <Text style={styles.learningSubtitle}>
                  {vocabularyCount}{" "}
                  {vocabularyCount === 1 ? "word" : "words"} from this lesson
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.learningRow}>
              <View>
                <Text style={styles.learningTitle}>Grammar</Text>
                <Text style={styles.learningSubtitle}>
                  {grammarCount}{" "}
                  {grammarCount === 1 ? "point" : "points"} from this lesson
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A LITTLE FEEDBACK</Text>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>
              You practiced speaking by responding to a character in Turkish.
              Keep practicing complete sentences and using the vocabulary from
              this lesson in future conversations.
            </Text>
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Text style={styles.continueArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.reviewText}>Review this lesson</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  celebrationCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  celebrationIcon: {
    color: COLORS.navy,
    fontSize: 38,
    fontWeight: "900",
  },

  completionLabel: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    color: COLORS.cream,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
  },

  subtitle: {
    color: COLORS.creamSoft,
    fontSize: 15,
    textAlign: "center",
  },

  progressCard: {
    backgroundColor: COLORS.navyLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },

  progressPercentage: {
    color: COLORS.cream,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },

  progressTrack: {
    height: 9,
    backgroundColor: COLORS.navySoft,
    borderRadius: 5,
    overflow: "hidden",
  },

  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gold,
    borderRadius: 5,
  },

  progressText: {
    color: COLORS.creamSoft,
    fontSize: 13,
    marginTop: 9,
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    color: COLORS.creamSoft,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 10,
    marginLeft: 4,
  },

  performanceCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    paddingHorizontal: 18,
  },

  performanceRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  performanceLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },

  performanceValue: {
    color: COLORS.brown,
    fontSize: 15,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.sage,
  },

  completedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  completedBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  learningCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    paddingHorizontal: 18,
  },

  learningRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  learningTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },

  learningSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },

  arrow: {
    color: COLORS.brown,
    fontSize: 30,
    fontWeight: "300",
  },

  feedbackCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 18,
  },

  feedbackText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
  },

  continueButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  continueText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "900",
  },

  continueArrow: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 10,
  },

  reviewButton: {
    alignItems: "center",
    paddingVertical: 18,
  },

  reviewText: {
    color: COLORS.creamSoft,
    fontSize: 14,
    fontWeight: "700",
  },
});