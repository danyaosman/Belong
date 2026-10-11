import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";

import { COLORS } from "../theme/colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

import { getLessons } from "../services/lessonService";
import { Lesson } from "../types/lesson";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen({
  navigation,
}: Props) {
  const { user, refreshUser } = useAuth()

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      refreshUser().catch((error) => {
        console.error("Failed to refresh user:", error);
      });
    }, [refreshUser])
  );

  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessons();
        setLessons(data);
      } catch (error) {
        console.error("Failed to load lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, []);
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>Belong</Text>

          <View style={styles.stats}>
            <Image
              source={require("../assets/heart.png")}
              style={styles.statIcon}
              resizeMode="contain"
             />
            <Text style={styles.stat}>{user?.hearts ?? 0}</Text>
              <Image
                source={require("../assets/xp.png")}
                style={styles.statIcon}
                resizeMode="contain"
            />
            <Text style={styles.stat}>{user?.xp ?? 0}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>LEVEL 1</Text>
          <Text style={styles.title}>Greetings</Text>
          <View style={styles.lessonPath}>
            {lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonNode,
                  index % 2 === 1 && styles.offset,
                ]}
                onPress={() => {
                  navigation.navigate("Lesson", {
                    lessonId: lesson.id,
                  });
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.nodeText}>★</Text>
              </TouchableOpacity>
            ))}

            {lessons.length >= 2 && (
              <Image
                source={require("../assets/dilara_peeking.png")}
                style={styles.dilaraPeeking}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </SafeAreaView>
      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/home.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Vocabulary")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/vocabulary.png")}
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/profile.png")}
            style={styles.profileIcon}
            resizeMode="contain"
          />
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

  dilaraPeeking: {
    position: "absolute",
    width: 135,
    height: 220,
    left: -28,
    top: "22%",
    zIndex: 1,
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

  navIcon: {
    width: 42,
    height: 42,
  },

  profileIcon: {
    width: 33,
    height: 33,
  },

  statIcon: {
    width: 25,
    height: 25,
  }

});