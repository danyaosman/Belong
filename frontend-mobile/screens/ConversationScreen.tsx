import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

export default function ConversationScreen({
  lessonId,
  onBack,
}: ConversationScreenProps) {
  const [conversationId, setConversationId] =
    useState<number | null>(null);

  const [currentMessage, setCurrentMessage] =
    useState("");

  const [messages, setMessages] = useState<
    {
      sender: "character" | "user";
      message: string;
    }[]
  >([]);

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
   * Start the conversation when the screen opens.
   */
  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      const conversation =
        await startConversation(lessonId);

      setConversationId(conversation.id);

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

  /*
   * Start conversation on first render.
   */
  useEffect(() => {
    initializeConversation();
  }, []);

  const handleSend = async () => {
    if (
      !currentMessage.trim() ||
      conversationId === null ||
      sending ||
      completed
    ) {
      return;
    }

    const userMessage = currentMessage.trim();

    try {
      setSending(true);
      setError(null);

      const result =
        await sendConversationMessage(
          conversationId,
          userMessage
        );

      setCorrect(result.correct);
      setFeedback(result.message);
      setHint(result.hint);
      
      if (result.correct) {
        // add users message
        setMessages((prev) => [
          ...prev,
          {
            sender:"user",
            message: userMessage
          },
        ]);

        // clear input
        setCurrentMessage("");

        //add characters next msg
        setMessages((prev) => [
          ...prev,
          {
            sender: "character",
            message: result.message
          },
        ]);
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

  if (loading) {
    return (
      <View style={styles.centerContent}>
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

  if (error && conversationId === null) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>
          {error}
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
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>
            ×
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Conversation
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Conversation */}

      <View style={styles.conversationArea}>
        <View style={styles.characterCircle}>
          <Text style={styles.characterEmoji}>
            👩🏻
          </Text>
        </View>

        <View style={styles.messageList}>
        {messages.map((item, index) => (
          <View
            key={index}
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
        </View>
       ))}
      </View>
    </View>
      {/* Feedback */}

      {feedback && (
        <View
          style={[
            styles.feedback,
            correct
              ? styles.correctFeedback
              : styles.incorrectFeedback,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {correct
              ? "✓ Correct!"
              : "✗ Almost!"}
          </Text>

          <Text style={styles.feedbackText}>
            {feedback}
          </Text>

          {!correct && hint && (
            <Text style={styles.hintText}>
              Hint: {hint}
            </Text>
          )}
        </View>
      )}

      {/* Completed */}

      {completed ? (
        <View style={styles.completedArea}>
          <Text style={styles.completedTitle}>
            🎉 Conversation complete!
          </Text>

          <Text style={styles.completedText}>
            Great job! You completed the
            conversation.
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={onBack}
          >
            <Text style={styles.continueButtonText}>
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Input */

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={currentMessage}
            onChangeText={setCurrentMessage}
            placeholder="Type your response..."
            placeholderTextColor="#999"
            multiline
            editable={!sending}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!currentMessage.trim() ||
                sending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={
              !currentMessage.trim() ||
              sending
            }
          >
            {sending ? (
              <ActivityIndicator
                color={COLORS.cream}
              />
            ) : (
              <Text style={styles.sendButtonText}>
                CHECK
              </Text>
            )}
          </TouchableOpacity>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.cream,
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "600",
  },

  errorText: {
    color: "#B42318",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E0D5",
    marginTop: 30,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    color: COLORS.navy,
    fontSize: 34,
    lineHeight: 36,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.navy,
  },

  headerSpacer: {
    width: 40,
  },

  conversationArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  characterCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  characterEmoji: {
    fontSize: 45,
  },

  characterName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.navy,
    marginBottom: 18,
  },

  characterBubble: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 20,
    maxWidth: "90%",
  },

  messageList: {
    width: "100%",
    marginTop: 10,
    flex: 1,
  },

  characterText: {
    color: COLORS.cream,
    fontSize: 16,
    lineHeight: 22,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.gold,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 18,
    maxWidth: "80%",
    marginBottom: 10,
  },

  userText: {
    color: COLORS.navy,
    fontSize: 16,
    lineHeight: 22,
  },

  feedback: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },

  correctFeedback: {
    backgroundColor: "#E7F5E9",
    borderTopColor: "#B7DDBD",
  },

  incorrectFeedback: {
    backgroundColor: "#FFF0EF",
    borderTopColor: "#E8B9B5",
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.navy,
    marginBottom: 4,
  },

  feedbackText: {
    fontSize: 14,
    color: COLORS.navy,
    lineHeight: 20,
  },

  hintText: {
    fontSize: 13,
    color: COLORS.navy,
    marginTop: 6,
    fontStyle: "italic",
  },

  inputArea: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: COLORS.cream,
  },

  input: {
    minHeight: 54,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#D6D0C4",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.navy,
    marginBottom: 12,
  },

  sendButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  completedArea: {
    padding: 24,
    alignItems: "center",
  },

  completedTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  completedText: {
    color: COLORS.navy,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },

  continueButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
  },

  continueButtonText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: "900",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    color: COLORS.cream,
    fontWeight: "800",
  },
});