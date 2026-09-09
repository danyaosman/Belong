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

import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { COLORS } from "../theme/colors";

import {
  sendConversationMessage,
  startConversation,
} from "../services/conversationService";

import { transcribeAudio } from "../services/sttService";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

import { useAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import {
  getLesson,
} from "../services/lessonService";

import {
  VocabularyItem,
} from "../types/lesson";

import InteractiveMessage from "../components/vocabulary/InteractiveMessage";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Conversation"
>;

interface Message {
  sender: "character" | "user";
  message: string;
}

export default function ConversationScreen({
  route,
  navigation,
}: Props) {
  const { lessonId } = route.params;

  const player = useAudioPlayer(null);

  const [conversationId, setConversationId] =
    useState<number | null>(null);

  const [totalSteps, setTotalSteps] =
    useState(1);
  const [currentStep, setCurrentStep] = 
    useState(1);

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

  const [vocabulary, setVocabulary] =
    useState<VocabularyItem[]>([]);

  const audioRecorder =
    useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const recorderState =
    useAudioRecorderState(audioRecorder);

  const [recording, setRecording] =
    useState(false);
    
  const [transcribing, setTranscribing] = useState(false);

  const playCharacterVoice = async (text: string) => {
    try {
      const response = await fetch(
        "https://spectrum-resize-nerd.ngrok-free.dev/tts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `TTS request failed: ${response.status}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      const bytes = new Uint8Array(arrayBuffer);

      let binary = "";

      const chunkSize = 8192;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(
          i,
          Math.min(i + chunkSize, bytes.length)
        );

        binary += String.fromCharCode(...chunk);
      }

      const base64 = btoa(binary);

      const fileUri =
        `${FileSystem.cacheDirectory}belong_tts_${Date.now()}.wav`;

      await FileSystem.writeAsStringAsync(
        fileUri,
        base64,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      player.replace(fileUri);
      player.play();

      console.log("Playing TTS:", fileUri);
    } catch (err) {
      console.error(
        "TTS playback error:",
        err
      );
    }
  };
  /*
   * ==========================================================
   * START CONVERSATION
   * ==========================================================
   */

  const initializeConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      const [conversation , lesson] =
        await Promise.all([
          startConversation(lessonId),
          getLesson(lessonId),
        ]);

        setConversationId(conversation.id);
        setCurrentStep(conversation.current_step);
        setTotalSteps(conversation.total_steps);

        setVocabulary(
          lesson.vocabulary ?? []
        );
        
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
        await playCharacterVoice(
          conversation.first_message
        );
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
   * RECORD VOICE SST
   * ==========================================================
   */

  useEffect(() => {
    const setupRecording = async () => {
      try {
        const permission =
          await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted) {
          console.log(
            "Microphone permission was denied."
          );
          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        console.log(
          "Microphone permission granted."
        );
      } catch (err) {
        console.error(
          "Failed to setup microphone:",
          err
        );
      }
    };

    setupRecording();
  }, []);


  const handleMicrophonePress = async () => {
    if (sending || completed) {
      return;
    }

    try {
      if (recording) {
        console.log("Stopping recording...");

        await audioRecorder.stop();

        setRecording(false);
        setTranscribing(true)

        const uri = audioRecorder.uri;

        if (!uri) {
          throw new Error(
            "Recording stopped but no audio file was created."
          );
        }

        console.log(
          "Recording saved:",
          uri
        );

        setError(null);

        console.log(
          "Sending recording to STT..."
        );

        const text =
          await transcribeAudio(uri);

        setTranscribing(false);
        setSending(true);

        console.log(
          "STT transcription:",
          text
        );

        if (!text.trim()) {
          throw new Error(
            "STT returned an empty transcription."
          );
        }
        
        // Put the transcription into the input state
        setCurrentMessage(text);

        console.log(
          "Sending transcription as conversation message..."
        );

        // Send the transcription directly
        // instead of waiting for the user to press Send.
        const userMessage = text.trim();

        if (conversationId === null) {
          throw new Error(
            "Conversation ID is missing."
          );
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "user",
            message: userMessage,
          },
        ]);

        setCurrentMessage("");

        const result =
          await sendConversationMessage(
            conversationId,
            userMessage
          );
        
        setCurrentStep(result.current_step);

        if (result.correct) {
          setFeedback(null);
          setCorrect(true);
          setHint(null);
        } else {
          setFeedback(result.message);
          setCorrect(false);
          setHint(result.hint);
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "character",
            message: result.message,
          },
        ]);

        await playCharacterVoice(
          result.message
        );

        if (result.completed) {
          setCompleted(true);
        }
      } else {
        console.log(
          "Starting recording..."
        );

        await audioRecorder.prepareToRecordAsync();

        audioRecorder.record();

        setRecording(true);
        setError(null);

        console.log(
          "Recording started."
        );
      }
    } catch (err) {
      console.error(
        "Recording/STT error:",
        err
      );

      setRecording(false);
      setSending(false);

      setError(
        "Unable to process your voice response."
      );
    } finally {
      setSending(false);
    }
  };

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

    const userMessage = currentMessage.trim();

    // Show the user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: userMessage,
      },
    ]);

    // Clear the input immediately
    setCurrentMessage("");

    try {
      setSending(true);
      setError(null);

      const result = await sendConversationMessage(
        conversationId,
        userMessage
      );

      setCurrentStep(result.current_step);

      if (result.correct) {
        setFeedback(null);
        setCorrect(true);
        setHint(null);
      } else {
        setFeedback(result.message);
        setCorrect(false);
        setHint(result.hint);
      }

      // Only add the character response when it arrives
      setMessages((prev) => [
        ...prev,
        {
          sender: "character",
          message: result.message,
        },
      ]);

      await playCharacterVoice(result.message);

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

  const conversationProgress = completed
    ? 100
    : 50 + (50 * (currentStep - 1)) / totalSteps;


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
          onPress={()=> navigation.goBack()}
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
          onPress={()=> navigation.goBack()}
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
                  width: `${conversationProgress}%`
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
            onPress={()=> navigation.goBack()}
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
                  <InteractiveMessage
                    message={item.message}
                    vocabulary={vocabulary}
                    textStyle={
                      item.sender === "user"
                      ? styles.userText
                      : styles.characterText
                    }
                  />
                    

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
            onPress={()=> navigation.goBack()}
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
              (sending || recording) &&
                  styles.micButtonDisabled,
              ]}
              onPress={handleMicrophonePress}
              disabled={
                sending || transcribing 
              }
              activeOpacity={0.8}
            >
              {recording ? (
                <Text style={styles.micIcon}>
                  ⏹️
                </Text>
              ) : transcribing || sending ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.navy}
                />
              ) : (
                <Text style={styles.micIcon}>
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
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: "700",
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