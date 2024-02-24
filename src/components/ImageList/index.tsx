import { ScreenSize, useDimensions } from "@/helpers/dimensions";
import { Product } from "@/types";
import { FlatList, Pressable, StyleProp, StyleSheet, Touchable, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import DiscountBadge from "@/core-ui";
import { useCallback, useState } from "react";

type Props = {
  product: Product;
  onImagePress: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ImageList({ product, onImagePress, style, contentContainerStyle }: Props) { 
  const [activeIndex, setActiveIndex] = useState(0);

  let {screenSize, width } = useDimensions();

  let isIphone = screenSize === ScreenSize.Small;
  let isLandscape = screenSize === ScreenSize.Large;
  let isTabletPortrait = screenSize === ScreenSize.Medium && !isLandscape;

  let imageSize = isLandscape
    ? { width: width / 2, height: '100%' }
    : { width, height: isIphone ? 450 : 576 };
  
  const onFlatlistUpdate = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
    //console.log(viewableItems);
  }, []);
  
  let renderProductImage = (
    { item, index, }: { item: string; index: number }
  ) => {
    return (
      <Pressable style={styles.flex} onPress={() => onImagePress(index)}>
        <RemoteImage
          path={item}
          style={imageSize as any}
          fallback={defaultPizzaImage}
          resizeMode="cover"
        />
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
  };

  return (
    <>
      <View style={{margin: "auto", width: width, height: 450, flex: 1}}>
        <FlatList
          data={product?.images}
          renderItem={renderProductImage}
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
        />
        <View style={styles.dots}>
          {product?.images &&
            product?.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === activeIndex ? "#000" : "#ededed",
                  },
                ]}
              />
            ))}
        </View>
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
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    bottom: 10,
    left: 0,
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