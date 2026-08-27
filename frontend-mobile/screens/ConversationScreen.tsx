import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

      {/* Character + Conversation */}

<View style={styles.conversationArea}>

  {/* Character Call Area */}

  <View style={styles.characterArea}>

    {characterAvatar ? (
      <Image
        source={{ uri: characterAvatar }}
        style={styles.characterImage}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.characterPlaceholder}>
        <Text style={styles.characterPlaceholderText}>
          👤
        </Text>
      </View>
    )}

    {/* Call controls */}

    <View style={styles.callControls}>

      <TouchableOpacity style={styles.callButton}>
        <Text style={styles.callButtonText}>
          🎤
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.endCallButton}
        onPress={onBack}
      >
        <Text style={styles.endCallButtonText}>
          ✕
        </Text>
      </TouchableOpacity>

    </View>

  </View>

  {/* Message history */}

  <ScrollView
    style={styles.messageList}
    contentContainerStyle={styles.messageListContent}
    showsVerticalScrollIndicator={false}
  >
    {messages.map((item, index) => (
      <View
        key={index}
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
          </View>
        </View>
        ))}
      </ScrollView>
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
          styles.micButton,
          sending && styles.sendButtonDisabled,
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
          <Text style={styles.micButtonText}>
            🎤
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
    backgroundColor: COLORS.navy,
  },

  characterArea: {
    height: 300,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
  },

  characterImage: {
    width: "85%",
    height: 270,
  },

  characterPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
  },

  characterPlaceholderText: {
    fontSize: 80,
  },

  callControls: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },

  callButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
  },

  callButtonText: {
    fontSize: 22,
  },

  endCallButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center",
  },

  endCallButtonText: {
    color: COLORS.cream,
    fontSize: 24,
    fontWeight: "800",
  },

  messageList: {
    flex: 1,
    paddingHorizontal: 20,
  },

  messageListContent: {
    paddingTop: 18,
    paddingBottom: 20,
  },

  characterMessageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:"flex-start",
    marginBottom: 14,
    paddingRight: 20,
  },

  userMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 14,
    paddingLeft: 30,
  },

  messageAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 8,
  },

  messageAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  characterBubble: {
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: "85%",
  },

  characterText: {
    color: COLORS.navy,
    fontSize: 16,
    lineHeight: 22,
  },

  userBubble: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: "78%",
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
    backgroundColor: "#89d294",
    borderTopColor: "#52d265",
  },

  incorrectFeedback: {
    backgroundColor: "#f17971",
    borderTopColor: "#ed6357",
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.cream,
    marginRight: 10,
  },

  micButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  micButtonText: {
    fontSize: 22,
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