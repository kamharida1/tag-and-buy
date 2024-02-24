import Colors from "@/constants/Colors";
import { Stack, router } from "expo-router";
import { Button } from "react-native";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          //backgroundColor: "#",
        },
        headerTintColor: "#000",
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          presentation: "modal",
          title: "Log in or sign up",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          title: "Reset Password",
          headerLeft: () => (
            <Button
              onPress={() => router.push("/(public)/login")}
              title="Back"
              color="#000"
            />
          )
        }}
      />
    </Stack>
  );
}