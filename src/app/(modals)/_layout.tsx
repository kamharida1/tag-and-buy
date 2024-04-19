import { Stack } from "expo-router";

export default function StackLayout() { 
  return (
    <Stack screenOptions={{
      headerShown: false,
      presentation: "modal"
    }}>
      <Stack.Screen name="search"  />
    </Stack>
  );
}
