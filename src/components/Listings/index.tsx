import { useEffect, useRef, useState } from "react";
import {
  BottomSheetFlatListMethods,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { Dimensions, ListRenderItem, StyleSheet, Touchable, View } from "react-native";
import { Link, useSegments } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { FadeInRight, FadeOutLeft, SharedTransition, withSpring } from "react-native-reanimated";
import { de } from "@faker-js/faker";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "@/types";
import { defaultStyles } from "@/constants/Styles";
import { RemoteImage } from "../RemoteImage";
import { Text } from "react-native";
import formatPrice from "@/utils/naira_price";

interface Props{
  listings: Tables<'products'>[];
  refresh: number;
  category: string;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AnimatedImage = Animated.createAnimatedComponent(RemoteImage);

const springOptions = {
  damping: 15,
};

export const transition = SharedTransition.custom((values) => {
  "worklet";
  return {
    width: withSpring(values.targetWidth, springOptions),
    height: withSpring(values.targetHeight, springOptions),
    originX: withSpring(values.targetOriginX, springOptions),
    originY: withSpring(values.targetOriginY, springOptions),
  };
});

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const Listings = ({ listings: items, refresh, category }: Props) => {
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const segments = useSegments();


  // Update the view to scroll the list back to the top
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  // Render one listing row for the FlatList
  const renderRow: ListRenderItem<any> = ({ item }) => (
    <Link href={`/${segments[0]}/home/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={styles.listing}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          <AnimatedImage
            sharedTransitionTag={item.id}
            sharedTransitionStyle={transition}
            path={item.image}
            fallback={defaultPizzaImage}
            style={styles.image}
          />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 300,
                right: 16,
                zIndex: 1,
              }}
            >
              <Ionicons name="ios-heart-outline" size={28} color="black" />
            </TouchableOpacity>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "airMedium",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                overflow: "hidden",
              }}
            >
              <Ionicons name="star" size={16} />
              <Text>{item.ratings}</Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: "airRegular",
              fontSize: 15,
              color: "#555",
              marginTop: 4,
            }}
          >
            {formatPrice(item.price)}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        ref={listRef}
        data={loading ? [] : items}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        onEndReached={() => console.log("End reached")}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <Text style={styles.info}>{items.length} products</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listing: {
    paddingHorizontal: 30,
    //gap: 10,
    marginVertical: 16,
  },
  image: {
    width: windowWidth - 60,
    alignSelf: "center",
    height: 350,
    borderRadius: 15,
    marginBottom: 10,
  },
  info: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 4,
  },
});

export default Listings;