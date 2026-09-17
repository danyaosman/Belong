import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS } from "../theme/colors";

import { useAudioPlayer } from "expo-audio";

import type { UserRecording } from "../types/feedback";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Feedback"
>;

export default function FeedbackScreen({
  navigation,
  route,
}: Props) {
  const {
    totalSteps,
    correctResponses,
    hintsUsed,
    usedVocab,
    userRecordings,
    xpEarned,
  } = route.params;

  const player = useAudioPlayer(null);

  const [playingIndex, setPlayingIndex] =
    useState<number | null>(null);

  const [loadingIndex, setLoadingIndex] =
    useState<number | null>(null);

  const handleContinue = () => {
    navigation.navigate("Home");
  };

  const playRecording = async (
    recording: UserRecording,
    index: number
  ) => {
    try {
      if (playingIndex === index) {
        player.pause();
        setPlayingIndex(null);
        return;
      }

      setLoadingIndex(index);

      player.replace(recording.audioUri);
      player.play();

      setPlayingIndex(index);
    } catch (error) {
      console.error(
        "Failed to play recording:",
        error
      );
    } finally {
      setLoadingIndex(null);
    }
  };

  const accuracy =
    totalSteps > 0
      ? Math.round(
          (correctResponses / totalSteps) * 100
        )
      : 0;

  const getFeedback = () => {
    if (accuracy === 100 && hintsUsed === 0) {
      return {
        title: "Excellent work!",
        text:
          "You responded correctly throughout the conversation without needing hints. Keep practicing this way to build confidence in Turkish.",
      };
    }

    if (accuracy >= 80) {
      return {
        title: "You're making great progress!",
        text:
          "You handled most of the conversation successfully. Keep practicing complete responses and try to rely less on hints as you become more comfortable.",
      };
    }

    if (accuracy >= 50) {
      return {
        title: "Good practice!",
        text:
          "You completed the conversation and had several successful responses. Review the vocabulary from this lesson and try the conversation again when you feel ready.",
      };
    }

    return {
      title: "Keep practicing!",
      text:
        "You completed the conversation, which is already useful speaking practice. Review the lesson vocabulary and focus on building complete responses.",
    };
  };

  const feedback = getFeedback();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            COMPLETION
        ========================== */}

        <View style={styles.hero}>
          <View style={styles.celebrationCircle}>
            <Text style={styles.celebrationIcon}>
              ✓
            </Text>
          </View>

          <Text style={styles.completionLabel}>
            LESSON COMPLETE
          </Text>

          <Text style={styles.title}>
            Great job!
          </Text>

          <Text style={styles.subtitle}>
            You completed the conversation.
          </Text>
        </View>

        {/* =========================
            YOUR RESPONSES
        ========================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            YOUR RESPONSES
          </Text>

          <View style={styles.recordingsCard}>
            <ScrollView
              style={styles.recordingsList}
              contentContainerStyle={
                styles.recordingsContent
              }
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {userRecordings.length === 0 ? (
                <Text style={styles.emptyText}>
                  No recordings available.
                </Text>
              ) : (
                userRecordings.map(
                  (recording, index) => (
                    <View
                      key={`${index}-${recording.audioUri}`}
                      style={styles.recordingRow}
                    >
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() =>
                          playRecording(
                            recording,
                            index
                          )
                        }
                        activeOpacity={0.8}
                      >
                        {loadingIndex === index ? (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.navy}
                          />
                        ) : (
                          <Text
                            style={
                              styles.playIcon
                            }
                          >
                            {playingIndex === index
                              ? "Ⅱ"
                              : "▶"}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <View
                        style={
                          styles.recordingInfo
                        }
                      >
                        <Text
                          style={
                            styles.recordingLabel
                          }
                        >
                          Response {index + 1}
                        </Text>

                        <Text
                          style={
                            styles.recordingText
                          }
                          numberOfLines={2}
                        >
                          {recording.text}
                        </Text>
                      </View>
                    </View>
                  )
                )
              )}
            </ScrollView>
          </View>
        </View>

      {/* =========================
          XP REWARD
      ========================== */}

      <View style={styles.progressCard}>
        <Text style={styles.progressPercentage}>
          +{xpEarned} XP
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${accuracy}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {accuracy}% conversation accuracy
        </Text>
      </View>

        {/* =========================
            PERFORMANCE
        ========================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            YOUR PERFORMANCE
          </Text>

          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Conversation
              </Text>

              <Text style={styles.performanceValue}>
                {totalSteps}{" "}
                {totalSteps === 1
                  ? "turn"
                  : "turns"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Correct
              </Text>

              <Text style={styles.performanceValue}>
                {correctResponses}/{totalSteps}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Accuracy
              </Text>

              <Text style={styles.performanceValue}>
                {accuracy}%
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Hints used
              </Text>

              <Text style={styles.performanceValue}>
                {hintsUsed}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>
                Speaking
              </Text>

              <View style={styles.completedBadge}>
                <Text
                  style={
                    styles.completedBadgeText
                  }
                >
                  ✓ Completed
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* =========================
            WHAT YOU PRACTICED
        ========================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            WHAT YOU PRACTICED
          </Text>

          <View style={styles.learningCard}>
            {usedVocab.length === 0 ? (
                <Text style={styles.emptyVocabularyText}>
                No lesson vocabulary was used in the conversation.
                </Text>
            ) : (
                usedVocab.map((item, index) => (
                <View
                    key={`${item.turkish}-${index}`}
                    style={styles.vocabularyRow}
                >
                    <View>
                    <Text style={styles.vocabularyTurkish}>
                        {item.turkish}
                    </Text>

                    <Text style={styles.vocabularyEnglish}>
                        {item.english}
                    </Text>
                </View>
            </View>
            ))
        )}
        </View>
        </View>

        {/* =========================
            FEEDBACK
        ========================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            A LITTLE FEEDBACK
          </Text>

          <View style={styles.feedbackCard}>
            <Text
              style={styles.feedbackTitle}
            >
              {feedback.title}
            </Text>

            <Text
              style={styles.feedbackText}
            >
              {feedback.text}
            </Text>
          </View>
        </View>

        {/* =========================
            CONTINUE
        ========================== */}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.continueArrow}>
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

  /*
   * RECORDINGS
   */

  recordingsCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    overflow: "hidden",
  },

  recordingsList: {
    maxHeight: 260,
  },

  recordingsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  recordingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  playIcon: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "900",
  },

  recordingInfo: {
    flex: 1,
  },

  recordingLabel: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 3,
  },

  recordingText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 19,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    paddingVertical: 18,
    textAlign: "center",
  },

  /*
   * PROGRESS
   */

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

  /*
   * SECTIONS
   */

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

  /*
   * PERFORMANCE
   */

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

  /*
   * VOCABULARY
   */

  learningCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    paddingHorizontal: 18,
  },

  learningRow: {
    minHeight: 70,
    justifyContent: "center",
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

  vocabularyRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sage,
  },

  vocabularyTurkish: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "800",
  },

  vocabularyEnglish: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 3,
  },

  emptyVocabularyText: {
    color: COLORS.muted,
    fontSize: 14,
    paddingVertical: 18,
    textAlign: "center",
  },

  /*
   * FEEDBACK
   */

  feedbackCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 18,
  },

  feedbackTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 7,
  },

  feedbackText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
  },

  /*
   * CONTINUE
   */

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
});