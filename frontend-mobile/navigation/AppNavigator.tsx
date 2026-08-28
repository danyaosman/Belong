import React from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import LessonScreen from "../screens/LessonScreen";
import ConversationScreen from "../screens/ConversationScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Lesson: {
    lessonId: number;
  };
  Conversation: {
    lessonId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="Lesson"
              component={LessonScreen}
            />

            <Stack.Screen
              name="Conversation"
              component={ConversationScreen}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}