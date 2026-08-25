import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "./theme/colors";
import LessonScreen from "./screens/LessonScreen";

export default function App() {
  const [screen, setScreen] = useState<"home" | "lesson">("home");

  if (screen === "lesson") {
    return (
      <LessonScreen
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>Belong</Text>

          <View style={styles.stats}>
            <Text style={styles.stat}>🔥 7</Text>
            <Text style={styles.stat}>✦ 1,250</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>LEVEL 1</Text>
          <Text style={styles.title}>Greetings</Text>

          <View style={styles.lessonPath}>
            {/* LESSON 1 */}
            <TouchableOpacity
              style={styles.lessonNode}
              onPress={() => {
                console.log("LEESON PRESSED");
                setScreen("lesson");}}
              activeOpacity={0.8}
            >
              <Text style={styles.nodeText}>★</Text>
            </TouchableOpacity>

            {/* LESSON 2 */}
            <TouchableOpacity
              style={[styles.lessonNode, styles.offset]}
              activeOpacity={0.8}
            >
              <Text style={styles.nodeText}>★</Text>
            </TouchableOpacity>

            {/* LISTENING */}
            <TouchableOpacity
              style={styles.lessonNode}
              activeOpacity={0.8}
            >
              <Text style={styles.nodeText}>🎧</Text>
            </TouchableOpacity>

            {/* LESSON 4 */}
            <TouchableOpacity
              style={[styles.lessonNode, styles.offset]}
              activeOpacity={0.8}
            >
              <Text style={styles.nodeText}>★</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>⌂</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>▣</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>●</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: COLORS.navy,
    fontSize: 28,
    fontWeight: "800",
  },

  stats: {
    flexDirection: "row",
    gap: 16,
  },

  stat: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  sectionLabel: {
    color: COLORS.brown,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },

  title: {
    color: COLORS.navy,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
  },

  lessonPath: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },

  lessonNode: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.sage,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.brown,
  },

  offset: {
    marginLeft: 90,
  },

  nodeText: {
    fontSize: 34,
    color: COLORS.gold,
  },

  bottomNav: {
    height: 96,
    backgroundColor: COLORS.navy,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  navItem: {
    color: COLORS.cream,
    fontSize: 30,
  },
});