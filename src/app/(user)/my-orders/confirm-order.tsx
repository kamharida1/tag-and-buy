import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import tw from 'twrnc'
import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";

export default function ConfirmOrder() {
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/(user)/home/");
  //   }, 2000);
  // }, []);

  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <AppText>
        Your order has been confirmed. You will be redirected to the home page
        in a few seconds.
      </AppText>
    </View>
  );
}
