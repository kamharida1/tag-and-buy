import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { memo, useState } from 'react'
import { Product } from '@/types';
import { ScreenSize, useDimensions } from '@/helpers/dimensions';
import { RemoteImage } from '../RemoteImage';
import DiscountBadge from '@/core-ui';
import { defaultPizzaImage } from '../ProductListItem';
import Animated from 'react-native-reanimated';
import { Link, router, useSegments } from 'expo-router';

interface ImageListItemProps {
  product: Product;
  onImagePress: (index: number) => void;
  item: string;
  index: number;
  loading: boolean;
  setIsLoading: Function;
};

const AnimatedImage = Animated.createAnimatedComponent(RemoteImage);

const ImageListItem = memo<ImageListItemProps>(({
  product,
  onImagePress,
  item,
  index,
  loading,
  setIsLoading,
}) => {
  let { screenSize, width } = useDimensions();

  let isIphone = screenSize === ScreenSize.Small;
  let isLandscape = screenSize === ScreenSize.Large;
  let isTabletPortrait = screenSize === ScreenSize.Medium && !isLandscape;

  let imageSize = isLandscape
    ? { width: width / 2, height: "100%" }
    : { width, height: isIphone ? 450 : 576 };
  return (
      <Pressable onPress={() => onImagePress(index)}>
        <Animated.View
          style={[imageSize as any]}
          //sharedTransitionTag="`container_${item}`"
        >
          {loading && (
            <ActivityIndicator
              style={StyleSheet.absoluteFill}
              size="large"
              animating={true}
            />
          )}
          <AnimatedImage
            //sharedTransitionTag={`image_${item}`}
            path={item}
            style={{ flex: 1 }}
            fallback={defaultPizzaImage}
            contentFit="cover"
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        </Animated.View>
        {product.discount > 0 ? (
          <DiscountBadge
            value={product?.discount}
            containerStyle={
              isIphone
                ? [styles.discountBox, styles.discountBoxTablet]
                : styles.discountBox
            }
            textStyle={isTabletPortrait && styles.discountBoxTabletText}
          />
        ) : null}
      </Pressable>
  );
})

export default ImageListItem

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
})