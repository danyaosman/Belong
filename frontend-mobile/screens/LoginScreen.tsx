import React, {
  useState,
} from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
  "Login"
>;

export default function LoginScreen({
  navigation,
}: Props) {
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setError("");
      setLoading(true);

      await login({
        email: email.trim(),
        password,
      });
    } catch (error: any) {
      setError(
        error?.message ||
          "Unable to log in. Please try again.",
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
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text
                style={styles.logoSymbol}
              >
                ✦
              </Text>
            </View>

            <Text style={styles.logo}>
              Belong
            </Text>

            <Text style={styles.subtitle}>
              Learn. Speak. Belong.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              Welcome back
            </Text>

            <Text style={styles.description}>
              Continue your language
              journey.
            </Text>

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
              placeholder="Your password"
              placeholderTextColor={
                COLORS.muted
              }
              secureTextEntry
              autoCapitalize="none"
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
                styles.loginButton,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={handleLogin}
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
                    styles.loginButtonText
                  }
                >
                  Log in
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={styles.registerRow}
          >
            <Text
              style={styles.registerText}
            >
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Register",
                )
              }
            >
              <Text
                style={
                  styles.registerLink
                }
              >
                Create one
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.navy,
    borderWidth: 4,
    borderColor: COLORS.sage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  logoSymbol: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: "800",
  },

  logo: {
    color: COLORS.navy,
    fontSize: 32,
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
    fontSize: 26,
    fontWeight: "800",
  },

  description: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 24,
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

  loginButton: {
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

  loginButtonText: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    gap: 5,
  },

  registerText: {
    color: COLORS.muted,
    fontSize: 14,
  },

  registerLink: {
    color: COLORS.brown,
    fontSize: 14,
    fontWeight: "800",
  },
});