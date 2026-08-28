import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { COLORS } from "../theme/colors";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;

export default function ProfileScreen({
  navigation,
}: Props) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Profile */}
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>

        <Text style={styles.username}>
          {user?.username || "User"}
        </Text>

        <Text style={styles.email}>
          {user?.email || ""}
        </Text>

        {/* Information card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Native language
            </Text>

            <Text style={styles.infoValue}>
              {user?.native_language || "—"}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.ivory,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: COLORS.navy,
    fontSize: 34,
    fontWeight: "500",
    lineHeight: 38,
  },

  headerTitle: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 44,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 35,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.navy,
    borderWidth: 5,
    borderColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.cream,
    fontSize: 42,
    fontWeight: "800",
  },

  username: {
    marginTop: 18,
    color: COLORS.navy,
    fontSize: 28,
    fontWeight: "800",
  },

  email: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 15,
  },

  infoCard: {
    width: "100%",
    marginTop: 35,
    padding: 20,
    backgroundColor: COLORS.ivory,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "600",
  },

  infoValue: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.brown,
    alignItems: "center",
  },

  logoutText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
});