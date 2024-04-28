import AppText from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import {  Slot, Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";

export default function MyOrderStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (<AppText fontSize="extraLarge" fontFamily="airBold">Orders</AppText>),
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
      <Stack.Screen name="[order-detail]" options={{ title: 'Order Details'}} />
      <Stack.Screen name="confirm-order" options={{ title: 'Order Confirmed'}} />
    </Stack>
  );
}
