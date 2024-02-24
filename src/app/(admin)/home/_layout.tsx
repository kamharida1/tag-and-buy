import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, Stack, router } from "expo-router";
import { Pressable } from "react-native";
import Colors from "../../../constants/Colors";
import { Text } from "react-native";

import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export const LogoutButton = () => {
  const { signOut, getToken } = useAuth();
  const doLogout = () => {
    signOut();
  };
  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color= {Colors.light.tabIconSelected} />
    </Pressable>
  );
};


export default function HomeStack() {
  const { signOut, getToken } = useAuth();
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    const GetToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    GetToken();
  }, []);

  console.log(token);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Products",
          headerTitleStyle: { fontFamily: "airMedium" },
          headerRight: () => (
            <Link href="/(admin)/home/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-square-o"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => <LogoutButton />,
        }}
      />
      {/* <Stack.Screen
        name="[url]"
        options={{
          headerShown: true,
          // presentation: "card",
          // animation: "fade_from_bottom",
          headerRight: () => (
            <Link href="/(admin)" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      /> */}
    </Stack>
  );
}
