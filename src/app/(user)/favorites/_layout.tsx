import { Stack } from "expo-router";

export default function Favorites() {
  return (
    <Stack >  
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  );
}
