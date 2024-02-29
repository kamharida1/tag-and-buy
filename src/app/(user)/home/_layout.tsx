import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, router } from "expo-router";
import { Pressable } from "react-native";
import Colors from "../../../constants/Colors";
import { Text, View } from "moti";
import tw from "twrnc";

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        // headerRight: () => (
        //   <Link href="/cart" asChild>
        //     <Pressable>
        //       {({ pressed }) => (
        //         <FontAwesome
        //           name="shopping-cart"
        //           size={25}
        //           color={Colors.light.tint}
        //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        //         />
        //       )}
        //     </Pressable>
        //   </Link>
        // ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "home" }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      {/* <Stack.Screen name="[item]" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
