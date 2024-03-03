//import { transition } from "@/components/ImageListItem";
import { RemoteImage } from "@/components/RemoteImage";
import RoundIconButton from "@/components/RoundIconButton";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, FadeInDown, FadeInUp, SharedTransition, SlideInDown, SlideInUp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView,  useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedRemoteImage = Animated.createAnimatedComponent(RemoteImage);
const { width } = Dimensions.get("window");


export default function ImageItem() {
  const { item } = useLocalSearchParams();
   const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const { top } = useSafeAreaInsets();
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log(e.translationX, e.translationY);
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      // const distanceY = Math.abs(e.translationY);
      // const threshold = 400
      // if (distanceY > threshold) {
      //   setIsImageModalVisible(false);
      // }
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });
  
  const composed = Gesture.Race(dragGesture, zoomGesture);
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <Animated.View
        entering={SlideInDown.duration(500)}
        //exiting={SlideInUp.duration(500)}
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
            top: 35,
            left: 20,
          }}
          name="close"
          size={40}
          color="bgSurface"
        />
        <Animated.View
          style={{
            width: Dimensions.get("window").width - 40,
            height: Dimensions.get("window").height - 200,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#c9c9c9",
            overflow: "hidden",
          }}
          
        >
          <GestureDetector gesture={composed}>
            <AnimatedRemoteImage
              path={item as string}
              style={[
                animatedStyles,
                {
                  ...StyleSheet.absoluteFillObject,
                },
              ]}
              fallback={""}
              cachePolicy={"memory-disk"}
              blurRadius={0}
              contentFit="contain"
            />
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    </>
  );
}
