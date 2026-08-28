import React, {
  useState,
} from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../theme/colors";

import { useAuth } from "../context/AuthContext";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({
  navigation,
}: Props) {
  const { register } = useAuth();

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [nativeLanguage, setNativeLanguage] =
    useState("English");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleRegister() {
    if (
      !email.trim() ||
      !username.trim() ||
      !password ||
      !nativeLanguage.trim()
    ) {
      setError(
        "Please fill in all fields.",
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters.",
      );
      return;
    }

    try {
      setError("");
      setLoading(true);

      await register({
        email: email.trim(),
        username: username.trim(),
        password,
        native_language:
          nativeLanguage.trim(),
      });
    } catch (error: any) {
      setError(
        error?.message ||
          "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
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
      <SafeAreaView
        style={styles.safeArea}
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={styles.backText}
            >
              ← Back
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View
              style={styles.logoCircle}
            >
              <Text
                style={styles.logoSymbol}
              >
                ✦
              </Text>
            </View>

            <Text style={styles.logo}>
              Join Belong
            </Text>

            <Text
              style={styles.subtitle}
            >
              Start your language
              journey.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Create your account
            </Text>

            <Text style={styles.label}>
              Username
            </Text>

            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor={
                COLORS.muted
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={
                COLORS.muted
              }
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />

            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={
                COLORS.muted
              }
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Native language
            </Text>

            <TextInput
              style={styles.input}
              value={nativeLanguage}
              onChangeText={
                setNativeLanguage
              }
              placeholder="English"
              placeholderTextColor={
                COLORS.muted
              }
              autoCapitalize="words"
            />

            {error ? (
              <View
                style={styles.errorBox}
              >
                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.registerButton,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator
                  color={COLORS.navy}
                />
              ) : (
                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  Create account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={styles.loginRow}
          >
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Login",
                )
              }
            >
              <Text
                style={styles.loginLink}
              >
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 22,
  },

  backText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.navy,
    borderWidth: 4,
    borderColor: COLORS.sage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  logoSymbol: {
    color: COLORS.gold,
    fontSize: 25,
    fontWeight: "800",
  },

  logo: {
    color: COLORS.navy,
    fontSize: 29,
    fontWeight: "800",
  },

  subtitle: {
    color: COLORS.brown,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.ivory,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },

  title: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 22,
  },

  label: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.sage,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 17,
  },

  errorBox: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 11,
    marginBottom: 15,
  },

  errorText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  registerButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: COLORS.brown,
  },

  disabledButton: {
    opacity: 0.65,
  },

  registerButtonText: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 22,
  },

  loginText: {
    color: COLORS.muted,
    fontSize: 14,
  },

  loginLink: {
    color: COLORS.brown,
    fontSize: 14,
    fontWeight: "800",
  },
});