import { Ionicons } from "@expo/vector-icons";
import {  Slot, Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";

export default function MyOrderStack() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Orders',
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={tw`w-9 h-9 mb-3 items-center justify-center rounded-full bg-gray-200`}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen name="[id]" options={{ title: 'Order Details'}} />
    </Stack>
  );
}
