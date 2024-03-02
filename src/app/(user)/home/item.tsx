//import { transition } from "@/components/ImageListItem";
import { RemoteImage } from "@/components/RemoteImage";
import RoundIconButton from "@/components/RoundIconButton";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import Animated, { Easing, FadeInDown, FadeInUp, SharedTransition, SlideInDown, SlideInUp, withTiming } from "react-native-reanimated";
import { SafeAreaView,  useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedRemoteImage = Animated.createAnimatedComponent(RemoteImage);
const { width } = Dimensions.get("window");


export default function ImageItem() {
  const { item } = useLocalSearchParams();
  const {top} = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View
        entering={SlideInDown.duration(500)}
        style={{
          flex: 1,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: top,
        }}
      >
        <RoundIconButton
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 30,
            left: 10,
          }}
          name="close"
          size={40}
          color="bgSurface"
        />
        <Animated.View
          style={{
            width: width,
            height: 400,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
          sharedTransitionTag={`container_${item}`}
          //sharedTransitionStyle={transition}
        >
            <AnimatedRemoteImage
              sharedTransitionTag={`image_${item}`}
              //sharedTransitionStyle={transition}
              path={item as string}
              style={StyleSheet.absoluteFillObject}
              fallback={""}
              cachePolicy={"memory-disk"}
              blurRadius={0}
            />
        </Animated.View>
      </Animated.View>
    </>
  );
}
