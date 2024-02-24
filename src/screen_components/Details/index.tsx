import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { faker } from "@faker-js/faker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DATA = Array(10)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    avatar: faker.image.avatar(),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  }));

const Page = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    console.log(event.contentOffset.y);
  });

  const headerStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      height: interpolate(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE],
        [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolate.CLAMP
      ),
    };
  });

  const imageOpacity = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: interpolate(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        [1, 0.5, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const imageTranslateY = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE],
            [0, 100],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const textScale = useAnimatedStyle(() => { 
    "worklet";
    return {
      fontSize: withSpring(interpolate(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        [30, 20, 16],
        Extrapolate.CLAMP
      ), { damping: 10, stiffness: 100 }),
      color: interpolateColor(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        ["#fff", "#fff", "#000"]
      ),
    };
  });

  const titleScale = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            [1, 0.2, 0.5],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const titleTranslateY = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            [0, 0, -8],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const renderListItem = (item: any) => (
    <View key={item.id} style={styles.card}>
      <Image style={styles.avatar} source={{ uri: item.avatar }} />
      <Text
        numberOfLines={2}
        style={styles.fullNameText}>{item.fullName}</Text>
    </View>
  );

  const rstyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 300],
      [0.5, 1],
      Extrapolate.CLAMP
    );
    const transY = interpolate(
      scrollY.value,
      [0, 300],
      [0, 100],
      Extrapolate.CLAMP
    );

    const borderRadius = withTiming(
      interpolate(
      scrollY.value,
      [0, 300],
      [100, 5],
      Extrapolate.CLAMP
    ), { duration: 300 });
    const borderWidth = interpolate(
      scrollY.value,
      [0, 300],
      [1, 3],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY: transY }],
      borderRadius,
      borderWidth,
      borderColor: "#999",  
      alignItems: "center",
      justifyContent: "center",
    };
  });
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.saveArea, { paddingTop: insets.top }]}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT -32,
          backgroundColor: "#fff",
        }}
      >
        {DATA.map(renderListItem)}
      </Animated.ScrollView>
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Image
          style={[styles.headerBackground, imageOpacity, imageTranslateY]}
          source={require("../../assets/images/frz.jpeg")}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.topBar,
          titleScale,
          titleTranslateY,
          // { paddingTop: insets.top },
        ]}
      >
        <Animated.Text style={[styles.title, textScale]}>Management</Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.bottom, rstyle]}>
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 17,
            fontFamily: "airMedium",
          }}
        >
          Bottom
        </Text>
      </Animated.View>
      <StatusBar style="light" />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: "#eff3fb",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
    shadowRadius: 7,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#62d1bc",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  topBar: {
    marginTop: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "airBold",
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: "contain",
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
    fontFamily: "airMedium",
  },
  bottom: {
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    width: 260,
    marginHorizontal: 80,
    marginBottom: 20,
  },
});
