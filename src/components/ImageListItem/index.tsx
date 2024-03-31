import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, Vibration, View, ViewStyle } from 'react-native'
import React, { memo, useMemo, useState } from 'react'
import { Product } from '@/types';
import { ScreenSize, useDimensions } from '@/helpers/dimensions';
import { RemoteImage } from '../RemoteImage';
import { defaultPizzaImage } from '../ProductListItem';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { BlurView } from "expo-blur";
import {HEADER_SCROLL_DISTANCE,HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT as IMG_HEIGHT,} from '@/constants'


interface ImageListItemProps {
  product: Product;
  onImagePress: (index: number) => void;
  scrollOffset: Animated.SharedValue<number>;
  item: string;
  index: number;
  loading: boolean;
  setIsLoading: Function;
};



const AnimatedImage = Animated.createAnimatedComponent(RemoteImage);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);


const ImageListItem = memo<ImageListItemProps>(
  ({
    product,
    //onImagePress,
    item,
    index,
    scrollOffset,
    loading,
    setIsLoading,
  }) => {
    let { screenSize, width } = useDimensions();

    let isIphone = screenSize === ScreenSize.Small;
    let isLandscape = screenSize === ScreenSize.Large;
    let isTabletPortrait = screenSize === ScreenSize.Medium && !isLandscape;

    let imageSize = isLandscape
      ? { width: width / 2, height: "100%" }
      : { width, height: isIphone ? IMG_HEIGHT : 576 };

    const imageAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          // {
          //   translateY: interpolate(
          //     scrollOffset.value,
          //     [ 0, 100, 200, HEADER_SCROLL_DISTANCE],
          //     [ 0, 0, 0, HEADER_MIN_HEIGHT],
          //     Extrapolate.CLAMP
          //   ),
          // },
          {
            scale: interpolate(
              scrollOffset.value,
              [ 0, -50],
              [1, 1.1],
              Extrapolate.CLAMP
            ),
          },
        ],
        opacity: interpolate(
          scrollOffset.value,
          [ 0, 150, 200, HEADER_SCROLL_DISTANCE],
          [ 1, 1, 1, 0],
          Extrapolate.CLAMP
        ),
      };
    });

    return (
      <Link href={`/(user)/home/item?item=${item}`} asChild>
        <Pressable>
          <Animated.View style={[imageSize as any, imageAnimatedStyle]}>
            {loading && (
              <ActivityIndicator
                style={StyleSheet.absoluteFill}
                size="large"
                animating={true}
              />
            )}
            <AnimatedImage
              path={item}
              style={StyleSheet.absoluteFill}
              fallback={defaultPizzaImage}
              resizeMode="cover"
              onLoad={() => {
                setIsLoading(false);
              }}
            >
            </AnimatedImage>
          </Animated.View>
        </Pressable>
      </Link>
    );
  }
);

export default ImageListItem

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: IMG_HEIGHT,
    resizeMode: "cover",
  },
  discountBox: {
    position: "absolute",
    top: 0,
    right: 15,
  },
  discountBoxTablet: {
    top: 60,
    height: 40,
    opacity: 0.8,
    paddingHorizontal: 12,
  },
  discountBoxTabletText: {
    fontSize: 16,
    fontFamily: "airMedium",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: "#ededed",
    borderColor: "#c9c9c9",
    margin: 2,
  },
});