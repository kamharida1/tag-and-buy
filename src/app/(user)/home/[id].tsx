import { useProduct } from "@/api/products";
import ImageList from "@/components/ImageList";
import { Text } from "@/components/Theme";
import { backgroundColor, position } from "@shopify/restyle";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_MAX_HEIGHT = 450;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ProductDetail() {

  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useProduct(id as string);
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

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

  const headerOpacity = useAnimatedStyle(() => {
   "worklet";
   return {
     opacity: interpolate(
       scrollY.value,
       [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
       [0.05, 0.3, 1],
        Extrapolate.CLAMP
     ),
     transform: [{ translateY: interpolate(scrollY.value, [0, HEADER_SCROLL_DISTANCE], [-100, 6], Extrapolate.CLAMP) }]
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

  const array = new Array(40).fill("");

  return (
    <View style={[styles.saveArea, { paddingTop: insets.top + 50 }]}>
      <Animated.View
        style={[
         { position: "absolute",
            top: insets.top + 6,
            left: 0,
            right: 0,
            zIndex: 10,
            alignItems: "center",
         },
         headerOpacity
        ]}
      >
        <Text style={{}}>Arnaud</Text>
        <Text style={{}}>379 tweets</Text>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT - 70,
          backgroundColor: "#fff",
          zindex: 3,
        }}
      >
        <Animated.View style={[{ flex: 1, paddingHorizontal: 16, overflow: "hidden" },]}>
          {array.map((_, index) => (
            <Text key={index}>Your text goes here</Text>
          ))}
        </Animated.View>
      </Animated.ScrollView>
      <Animated.View style={[styles.header, headerStyle]}>
        <ImageList scrollY={scrollY} product={product} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: "#eff3fb",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000050",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
  }
  
});
// import { Dimensions, Share, StyleSheet, Text, Touchable, View } from 'react-native'
//setActiveIndex,tActiveIndex,mport React, { useLayoutEffect } from 'react';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { useProduct } from '@/api/products';
// import Animated, { interpolate, runOnJS, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, useSharedValue, withSpring } from 'react-native-reanimated';
// import { Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
// import { Ionicons } from '@expo/vector-icons';
// import { RemoteImage } from '@/components/RemoteImage';
// import { defaultPizzaImage } from '@/components/ProductListItem';
// import { AnimatedImage, transition } from '@/components/Listings';
// import Colors from '@/constants/Colors';

// const { width } = Dimensions.get("window");
// const IMG_HEIGHT = 300;

// const FLING_LIMIT = 160;

// const springOptions = {
//   damping: 15,
// };

// const ProductDetail = () => {
//   const { id } = useLocalSearchParams();
//   const { data: product, isLoading, isError } = useProduct(id as string);
//   const navigation = useNavigation();

//   const scrollRef = useAnimatedRef<Animated.ScrollView>();

//    const translation = {
//      x: useSharedValue(0),
//      y: useSharedValue(0),
//    };
//    const runOnlyOnce = useSharedValue(false);

//    const goBack = () => {
//      navigation.goBack();
//    };
//   const pan = Gesture.Pan()
//     .onChange((event) => {
//       translation.x.value += event.changeX;
//       translation.y.value += event.changeY;

//       if (
//         event.translationY > FLING_LIMIT ||
//         event.translationY < -FLING_LIMIT ||
//         event.translationX > FLING_LIMIT ||
//         event.translationX < -FLING_LIMIT
//       ) {
//         if (!runOnlyOnce.value) {
//           runOnlyOnce.value = true;
//           runOnJS(goBack)();
//         }
//       }
//     })
//     .onFinalize(() => {
//       translation.x.value = withSpring(0, springOptions);
//       translation.y.value = withSpring(0, springOptions);
//     });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { translateX: translation.x.value },
//         { translateY: translation.y.value },
//         // prettier-ignore
//         { scale: 1 - (Math.abs(translation.x.value) + Math.abs(translation.y.value)) / 1000 },
//       ],
//     };
//   });

//   const shareListing = async () => {
//     try {
//       await Share.share({
//         title: product.title,
//         url: product.image,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <View style={styles.bar}>
//           <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
//             <Ionicons name="share-social" size={24} color="black" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
//             <Ionicons name="heart" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       ),
//       headerTitle: '',
//       headerTransparent: true,
//       headerBackground: () => (
//         <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
//       ),
//       headerLeft: () => (
//         <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={'#000'} />
//         </TouchableOpacity>
//       ),
//     });
//   }, []);

//   const scrollOffset = useScrollViewOffset(scrollRef);

//   const imageAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateY: interpolate(
//             scrollOffset.value,
//             [-IMG_HEIGHT, 0, IMG_HEIGHT],
//             [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
//           ),
//         },
//         {
//           scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
//         },
//       ],
//     };
//   });

//   const headerAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
//     };
//   }, []);

//   return (
//     // <GestureDetector gesture={pan}>
//       <View style={[styles.container]}>
//         <Animated.ScrollView
//           ref={scrollRef}
//           scrolllEventThrottle={16}
//           contentContainerStyle={{flex: 1, paddingBottom: 100,}}
//         >
//           <AnimatedImage
//             path={product?.image}
//             fallback={defaultPizzaImage}
//             style={[styles.image, imageAnimatedStyle]}
//           />
//           <View style={styles.infoContainer}>
//             <Text style={styles.name}>{product?.title}</Text>
//             <Text style={styles.footerPrice}>{product?.price}</Text>
//           </View>
//         </Animated.ScrollView>
//       </View>
//     // </GestureDetector>
//   );
// }

// export default ProductDetail;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   header: {
//     backgroundColor: "#fff",
//     height: 100,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: Colors.light.tabIconDefault,
//   },
//   bar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   description: {},
//   roundButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 50,
//     backgroundColor: "white",
//     alignItems: "center",
//     justifyContent: "center",
//     color: Colors.light.tabIconDefault,
//   },
//   footerText: {},
//   footerPrice: {},
//   hostView: {},
//   host: {},
//   divider: {},
//   ratings: {},
//   name: {},
//   infoContainer: {
//     padding: 24,
//   },
//   image: {
//     height: IMG_HEIGHT,
//     width: width,
//   },
// });
