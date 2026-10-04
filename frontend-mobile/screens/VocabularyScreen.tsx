import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  RootStackParamList,
} from "../navigation/AppNavigator";

import { COLORS } from "../theme/colors";

import { useAuth } from "../context/AuthContext";

import {
  getMyVocabulary,
} from "../services/vocabService";

import {
  UserVocabulary,
} from "../types/vocabulary";


type Props = NativeStackScreenProps<
  RootStackParamList,
  "Vocabulary"
>;


export default function VocabularyScreen({
  navigation,
}: Props) {
  const { token } = useAuth();

  const [
    vocabulary,
    setVocabulary,
  ] = useState<UserVocabulary[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadVocabulary() {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getMyVocabulary(token);

        setVocabulary(data);
      } catch (err) {
        console.error(
          "Failed to load vocabulary:",
          err,
        );

        setError(
          "Unable to load your vocabulary.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVocabulary();
  }, [token]);


  return (
    <View style={styles.container}>
      <SafeAreaView
        style={styles.safeArea}
      >

        <View style={styles.header}>
          <Text style={styles.title}>
            My Vocabulary
          </Text>

          <Text style={styles.count}>
            {vocabulary.length} words
          </Text>
        </View>


        {loading && (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={COLORS.navy}
            />
          </View>
        )}


        {!loading && error !== "" && (
          <View style={styles.center}>
            <Text style={styles.error}>
              {error}
            </Text>
          </View>
        )}


        {!loading &&
          !error &&
          vocabulary.length === 0 && (
            <View style={styles.center}>
              <Text
                style={styles.emptyTitle}
              >
                No vocabulary yet
              </Text>

              <Text
                style={styles.emptyText}
              >
                Complete a lesson to start
                building your vocabulary.
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate(
                    "Home"
                  )
                }
              >
                <Text
                  style={styles.buttonText}
                >
                  Start Learning
                </Text>
              </TouchableOpacity>
            </View>
          )}


        {!loading &&
          !error &&
          vocabulary.length > 0 && (
            <FlatList
              data={vocabulary}
              keyExtractor={(item) =>
                item.id.toString()
              }
              contentContainerStyle={
                styles.list
              }
              renderItem={({
                item,
              }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                >
                  <View
                    style={
                      styles.cardContent
                    }
                  >
                    <Text
                      style={
                        styles.turkish
                      }
                    >
                      {item.turkish}
                    </Text>

                    <Text
                      style={
                        styles.english
                      }
                    >
                      {item.english}
                    </Text>

                    {item.pronunciation && (
                      <Text
                        style={
                          styles.pronunciation
                        }
                      >
                        {item.pronunciation}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={styles.arrow}
                  >
                    ›
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

      </SafeAreaView>


      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate("Home")
          }
        >
          <Text style={styles.navItem}>
            ⌂
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navButton}
        >
          <Text style={styles.navItem}>
            📖
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navButton}
        >
          <Text style={styles.navItem}>
            💬
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate(
              "Profile"
            )
          }
        >
          <Text style={styles.navItem}>
            👤
          </Text>
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
    paddingTop: 20,
    paddingBottom: 16,
  },

  title: {
    color: COLORS.navy,
    fontSize: 30,
    fontWeight: "800",
  },

  count: {
    color: COLORS.brown,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardContent: {
    flex: 1,
  },

  turkish: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: "800",
  },

  english: {
    color: COLORS.brown,
    fontSize: 16,
    marginTop: 3,
  },

  pronunciation: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },

  arrow: {
    color: COLORS.navy,
    fontSize: 28,
    marginLeft: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyTitle: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: COLORS.brown,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  error: {
    color: COLORS.brown,
    fontSize: 16,
    textAlign: "center",
  },

  button: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 20,
  },

  buttonText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: "700",
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