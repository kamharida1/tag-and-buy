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
import { TouchableOpacity } from "react-native-gesture-handler";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import DiscountBadge from "@/core-ui";
import React, { useCallback, useState } from "react";
import ImageListItem from "../ImageListItem";
import Animated from "react-native-reanimated";
import { Text } from "../Theme";

type Props = {
  product: Product;
  // setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function ImageList({
  product,
  //
}: Props) {
  let [activeIndex, setActiveIndex] = useState(0);
  let [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  let { screenSize, width } = useDimensions();

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
              item={item}
              index={activeIndex = index}
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
          style={[styles.flex,]}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isImageModalVisible}
        onRequestClose={() => {
          setIsImageModalVisible(!isImageModalVisible);
        }}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <RemoteImage
            path={product?.images && product.images[activeIndex]}
            style={{ 
              width: Dimensions.get('window').width -40,
              height: Dimensions.get('window').height -80,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#c9c9c9',
              overflow: 'hidden',
             }}
            fallback={defaultPizzaImage}
            contentFit="cover"
          />

          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 20, fontFamily: 'airMedium', position: 'absolute', top: 20, right: 20 }} onPress={() => setIsImageModalVisible(!isImageModalVisible)}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    width: 400,
    height: 40,
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
