import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../theme/colors";

import {
  sendConversationMessage,
  startConversation,
} from "../services/conversationService";

interface ConversationScreenProps {
  lessonId: number;
  onBack: () => void;
}

interface Message {
  sender: "character" | "user";
  message: string;
}

export default function ConversationScreen({
  lessonId,
  onBack,
}: ConversationScreenProps) {
  const [conversationId, setConversationId] =
    useState<number | null>(null);

  const [currentMessage, setCurrentMessage] =
    useState("");

  const [characterAvatar, setCharacterAvatar] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [hint, setHint] =
    useState<string | null>(null);

  const [correct, setCorrect] =
    useState<boolean | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ==========================================================
   * START CONVERSATION
   * ==========================================================
   */

  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      const conversation =
        await startConversation(lessonId);

      setConversationId(conversation.id);

      setCharacterAvatar(
        conversation.character_avatar_url
          ? `https://spectrum-resize-nerd.ngrok-free.dev${conversation.character_avatar_url}`
          : null
      );

      setMessages([
        {
          sender: "character",
          message: conversation.first_message,
        },
      ]);
    } catch (err) {
      console.error(
        "Failed to start conversation:",
        err
      );

      setError(
        "Unable to start the conversation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeConversation();
  }, []);

  /*
   * ==========================================================
   * SEND MESSAGE
   * ==========================================================
   */

  const handleSend = async () => {
    if (
      !currentMessage.trim() ||
      conversationId === null ||
      sending ||
      completed
    ) {
      return;
    }

    const userMessage =
      currentMessage.trim();

    try {
      setSending(true);
      setError(null);

      const result =
        await sendConversationMessage(
          conversationId,
          userMessage
        );

      if (result.correct) {
        setFeedback(null);
        setCorrect(true);
        setHint(null);
      } else {
        setFeedback(result.message);
        setCorrect(false);
        setHint(result.hint);
      }

      if (result.correct) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "user",
            message: userMessage,
          },
          {
            sender: "character",
            message: result.message,
          },
        ]);

        setCurrentMessage("");
      }

      if (result.completed) {
        setCompleted(true);
      }
    } catch (err) {
      console.error(
        "Failed to send conversation message:",
        err
      );

      setError(
        "Unable to send your response."
      );
    } finally {
      setSending(false);
    }
  };

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color={COLORS.gold}
        />

        <Text style={styles.loadingText}>
          Starting conversation...
        </Text>
      </View>
    );
  }

  /*
   * ==========================================================
   * START ERROR
   * ==========================================================
   */

  if (
    error &&
    conversationId === null
  ) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.errorButtonText}>
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * ==========================================================
   * MOST RECENT CHARACTER MESSAGE
   * ==========================================================
   */

  const lastCharacterMessage =
    [...messages]
      .reverse()
      .find(
        (item) =>
          item.sender === "character"
      )?.message;

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : undefined}
  keyboardVerticalOffset={Platform.OS === "ios" ? -10 : 0}
>
    <View
      style={styles.container}
    >

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.topButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backIcon}>
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: completed
                    ? "100%"
                    : "25%",
                },
              ]}
            />
          </View>
        </View>

      </View>

      {/* =====================================================
          CHARACTER STAGE
      ===================================================== */}

      <View style={styles.characterStage}>
        <View style={styles.characterGlow} />

        {characterAvatar ? (
          <Image
            source={{
              uri: characterAvatar,
            }}
            style={styles.characterImage}
            resizeMode="contain"
          />
        ) : (
          <View
            style={styles.characterPlaceholder}
          >
            <Text
              style={
                styles.characterPlaceholderText
              }
            >
              ?
            </Text>
          </View>
        )}

        {/* Current speech bubble */}

        {lastCharacterMessage && (
          <View
            style={styles.speechBubble}
          >
            <Text
              style={styles.speechText}
              numberOfLines={4}
            >
              {lastCharacterMessage}
            </Text>

            <View
              style={styles.speechTail}
            />
          </View>
        )}

        {/* Call controls */}

        <View
          style={styles.callControls}
        >


          <TouchableOpacity
            style={styles.endCallButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text
              style={styles.endCallIcon}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =====================================================
          CONVERSATION HISTORY
      ===================================================== */}

      <View style={styles.chatArea}>
        <ScrollView
          style={styles.messageList}
          contentContainerStyle={
            styles.messageListContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {messages.map(
            (item, index) => (
              <View
                key={`${index}-${item.message}`}
                style={
                  item.sender === "user"
                    ? styles.userMessageRow
                    : styles.characterMessageRow
                }
              >
                <View
                  style={
                    item.sender === "user"
                      ? styles.userBubble
                      : styles.characterBubble
                  }
                >
                  <Text
                    style={
                      item.sender === "user"
                        ? styles.userText
                        : styles.characterText
                    }
                  >
                    {item.message}
                  </Text>

                  <View
                    style={
                      item.sender === "user"
                        ? styles.userBubbleFooter
                        : styles.characterBubbleFooter
                    }
                  >
                    <Text
                      style={
                        item.sender === "user"
                          ? styles.userTime
                          : styles.characterTime
                      }
                    >
                      {item.sender === "user"
                        ? "You"
                        : "Dilara"}
                    </Text>
                  </View>
                </View>
              </View>
            )
          )}

          {sending && (
            <View
              style={styles.typingRow}
            >
              <View
                style={styles.typingBubble}
              >
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          )}

          {error &&
            conversationId !== null && (
              <Text
                style={styles.inlineError}
              >
                {error}
              </Text>
            )}
        </ScrollView>
      </View>

      {/* =====================================================
          FEEDBACK
      ===================================================== */}

      {feedback && !correct && (
        <View
          style={[
            styles.feedback,
            styles.incorrectFeedback,
          ]}
        >
          <View
            style={styles.feedbackHeader}
          >
            <View
              style={[
                styles.feedbackIcon,
                styles.incorrectIcon,
              ]}
            >
              <Text
                style={
                  styles.feedbackIconText
                }
              >
              !
              </Text>
            </View>

            <Text
              style={styles.feedbackTitle}
            >
              "Almost!"
            </Text>
          </View>

          <Text
            style={styles.feedbackText}
          >
            {feedback}
          </Text>

          {hint && (
            <Text
              style={styles.hintText}
            >
              {hint}
            </Text>
          )}
        </View>
      )}

      {/* =====================================================
          COMPLETED
      ===================================================== */}

      {completed ? (
        <View
          style={styles.completedArea}
        >
          <Text
            style={styles.completedTitle}
          >
            🎉 Great job!
          </Text>

          <Text
            style={styles.completedText}
          >
            You completed the conversation.
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={onBack}
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.continueButtonText
              }
            >
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ===================================================
           INPUT
        =================================================== */

        <View style={styles.inputArea}>
          <View
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              value={currentMessage}
              onChangeText={
                setCurrentMessage
              }
              placeholder="Type your response..."
              placeholderTextColor={
                COLORS.muted
              }
              multiline
              editable={!sending}
              returnKeyType="send"
              onSubmitEditing={
                handleSend
              }
            />

            <TouchableOpacity
              style={[
                styles.micButton,
                sending &&
                  styles.micButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={
                !currentMessage.trim() ||
                sending
              }
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.navy}
                />
              ) : (
                <Text
                  style={styles.micIcon}
                >
                  🎤
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /*
   * ==========================================================
   * MAIN
   * ==========================================================
   */

  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 16,
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: "700",
  },

  errorScreen: {
    flex: 1,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  errorTitle: {
    color: COLORS.cream,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },

  errorText: {
    color: COLORS.creamSoft,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  errorButton: {
    marginTop: 24,
    paddingHorizontal: 28,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  errorButtonText: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /*
   * ==========================================================
   * TOP BAR
   * ==========================================================
   */

  topBar: {
    height: 76,
    paddingHorizontal: 18,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.navy,
  },

  topButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.navyLight,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    color: COLORS.cream,
    fontSize: 40,
    fontWeight: "300",
    lineHeight: 40,
  },

  progressContainer: {
    flex: 1,
    justifyContent: "center",
  },

  progressTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.navySoft,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.gold,
  },

  ccButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.navySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  ccText: {
    color: COLORS.goldLight,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /*
   * ==========================================================
   * CHARACTER
   * ==========================================================
   */

characterStage: {
  height: "38%",
  minHeight: 220,
  backgroundColor: COLORS.navy,
  alignItems: "center",
  justifyContent: "flex-end",
  position: "relative",
  overflow: "hidden",
},

  characterGlow: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: COLORS.navyLight,
    bottom: -100,
  },

  characterImage: {
    width: "78%",
    height: 310,
    marginBottom: 12,
  },

  characterPlaceholder: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: COLORS.navyLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  characterPlaceholderText: {
    color: COLORS.goldLight,
    fontSize: 70,
    fontWeight: "800",
  },

  /*
   * ==========================================================
   * SPEECH BUBBLE
   * ==========================================================
   */

  speechBubble: {
    position: "absolute",
    bottom: 82,
    maxWidth: "72%",
    minWidth: 170,
    backgroundColor: COLORS.creamLight,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 18,

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  speechText: {
    color: COLORS.navy,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    textAlign: "center",
  },

  speechTail: {
    position: "absolute",
    bottom: -9,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.creamLight,
  },

  /*
   * ==========================================================
   * CALL CONTROLS
   * ==========================================================
   */

  callControls: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },

  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.navyLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.navySoft,
  },

  controlIcon: {
    fontSize: 20,
  },

  endCallButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
  },

  endCallIcon: {
    color: COLORS.cream,
    fontSize: 23,
    fontWeight: "800",
  },

  /*
   * ==========================================================
   * CHAT AREA
   * ==========================================================
   */

  chatArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  messageList: {
    flex: 1,
    paddingHorizontal: 14,
  },

  messageListContent: {
    paddingTop: 18,
    paddingBottom: 20,
  },

  characterMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginBottom: 14,
    paddingRight: 24,
  },

  userMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 14,
    paddingLeft: 30,
  },

  /*
   * Character messages
   */

  characterBubble: {
    backgroundColor: COLORS.creamLight,
    borderWidth: 1,
    borderColor: COLORS.creamSoft,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: "82%",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  characterText: {
    color: COLORS.navy,
    fontSize: 16,
    lineHeight: 22,
  },

  /*
   * User messages
   */

  userBubble: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: "78%",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  userText: {
    color: COLORS.navy,
    fontSize: 16,
    lineHeight: 22,
  },

  /*
   * Bubble labels
   */

  characterBubbleFooter: {
    marginTop: 5,
  },

  userBubbleFooter: {
    marginTop: 5,
    alignItems: "flex-end",
  },

  characterTime: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "600",
  },

  userTime: {
    color: COLORS.navySoft,
    fontSize: 10,
    fontWeight: "700",
  },

  /*
   * ==========================================================
   * TYPING
   * ==========================================================
   */

  typingRow: {
    alignItems: "flex-start",
    marginBottom: 12,
  },

  typingBubble: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 19,
    backgroundColor: COLORS.creamSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.navySoft,
  },

  inlineError: {
    color: COLORS.error,
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },

  /*
   * ==========================================================
   * FEEDBACK
   * ==========================================================
   */

  feedback: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  correctFeedback: {
    backgroundColor: COLORS.success,
    borderTopColor: COLORS.success,
  },

  incorrectFeedback: {
    backgroundColor: COLORS.error,
    borderTopColor: COLORS.error,
  },

  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  feedbackIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  correctIcon: {
    backgroundColor: COLORS.goldLight,
  },

  incorrectIcon: {
    backgroundColor: COLORS.goldLight,
  },

  feedbackIconText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "900",
  },

  feedbackTitle: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: "900",
  },

  feedbackText: {
    color: COLORS.creamLight,
    fontSize: 13,
    lineHeight: 19,
  },

  hintText: {
    color: COLORS.creamSoft,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  /*
   * ==========================================================
   * INPUT
   * ==========================================================
   */

  inputArea: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.navyLight,
  },

  inputContainer: {
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.navySoft,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 6,
  },

  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 100,
    color: COLORS.cream,
    fontSize: 16,
    lineHeight: 21,
    paddingVertical: 12,
  },

  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  micButtonDisabled: {
    opacity: 0.55,
  },

  micIcon: {
    fontSize: 19,
  },

  /*
   * ==========================================================
   * COMPLETED
   * ==========================================================
   */

  completedArea: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 25,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.navyLight,
  },

  completedTitle: {
    color: COLORS.cream,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 4,
  },

  completedText: {
    color: COLORS.creamSoft,
    fontSize: 14,
    marginBottom: 14,
  },

  continueButton: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  continueButtonText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});