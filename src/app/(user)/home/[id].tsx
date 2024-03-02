import { useProduct } from "@/api/products";
import ImageList from "@/components/ImageList";
import ImageModal from "@/components/ImageModal";
import { Text } from "@/components/Theme";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ProductDetail() {

  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useProduct(id as string);
  const navigation = useNavigation();

  const goBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <ImageList
          product={product}
        />
        {/* <View style={{ flex: 1, padding: 16 }}>
          <Text> Hello World</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}
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
