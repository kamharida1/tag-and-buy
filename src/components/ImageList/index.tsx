import { ScreenSize, useDimensions } from "@/helpers/dimensions";
import { Product } from "@/types";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Touchable,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import React, { useCallback, useState } from "react";
import ImageListItem from "../ImageListItem";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Text } from "../Theme";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  product: Product;
  scrollOffset: Animated.SharedValue<number>;
};

// Define the props for the DotIndicator component
type DotIndicatorProps = {
  activeIndex: number;
  totalDots: number;
  style: StyleProp<ViewStyle>;
};

// Define the DotIndicator component
const DotIndicator: React.FC<DotIndicatorProps> = ({ activeIndex, totalDots, style }) => {
  return (
    <View style={styles.dots}>
      {Array.from({ length: totalDots }).map((_, i) => (
        <View
          key={i}
          style={[
            style,
            styles.dot,
            i === activeIndex ? { backgroundColor: "#c9c9c9" } : {},
          ]}
        />
      ))}
    </View>
  );
};

export default function ImageList({
  product,
  scrollOffset
}: Props) {
  let [activeIndex, setActiveIndex] = useState(0);
  let [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

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

  let { width } = useDimensions();

  let onPressImage = (index: number) => {
    setIsImageModalVisible(!isImageModalVisible);
    setActiveIndex(index);
  };


  const onFlatlistUpdate = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
    //console.log(viewableItems);
  }, []);

  return (
    <>
      <View style={{ margin: "auto", width: width, height: 450 }}>
        <Animated.FlatList
          data={product?.images}
          renderItem={({ item, index }) => (
            <ImageListItem
              scrollOffset={scrollOffset}
              item={item}
              index={(activeIndex = index)}
              product={product}
              onImagePress={onPressImage}
              loading={loading}
              setIsLoading={setLoading}
            />
          )}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={[styles.flex]}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
          }}
          onViewableItemsChanged={onFlatlistUpdate}
        />
        {product?.images && (
          <DotIndicator
            style={{ bottom: 10 }}
            activeIndex={activeIndex}
            totalDots={product.images.length}
          />
        )}
      </View>
    </>
  );
}

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
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ededed",
    margin: 2,
  },
});
