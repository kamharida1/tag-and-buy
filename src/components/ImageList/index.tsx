import { ScreenSize, useDimensions } from "@/helpers/dimensions";
import { Product } from "@/types";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Touchable,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import DiscountBadge from "@/core-ui";
import { useCallback, useState } from "react";
import ImageListItem from "../ImageListItem";

type Props = {
  product: Product;
  loading: boolean;
  setIsLoading: Function;
  onImagePress: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ImageList({
  product,
  onImagePress,
  style,
  loading,
  setIsLoading,
  contentContainerStyle,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  let { screenSize, width } = useDimensions();

  const onFlatlistUpdate = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
    //console.log(viewableItems);
  }, []);

  return (
    <>
      <View style={{ margin: "auto", width: width, height: 450, flex: 1 }}>
        <FlatList
          data={product?.images}
          renderItem={({ item, index }) => (
            <ImageListItem
              item={item}
              index={index}
              product={product}
              onImagePress={onImagePress}
              loading={loading}
              setIsLoading={setIsLoading}
            />
          )}
          keyExtractor={(item) => item}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={[styles.flex, style]}
          contentContainerStyle={contentContainerStyle}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 50,
          }}
          onViewableItemsChanged={onFlatlistUpdate}
          ListFooterComponent={() => (
            <View style={[styles.dots]}>
              {product?.images &&
                product?.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          index === activeIndex ? "#000" : "#ededed",
                      },
                    ]}
                  />
                ))}
            </View>
          )}
        />
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
    //alignSelf: "center",
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
