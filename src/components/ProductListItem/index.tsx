import { memo } from "react";
import { Tables } from "../../types"
import { Link, useSegments } from "expo-router";
import { Dimensions, Pressable, StyleSheet, } from "react-native";
import Colors from "@/constants/Colors";
import { RemoteImage } from "../RemoteImage";
import formatPrice from "@/utils/naira_price";
import Animated from "react-native-reanimated";
import { Box, Text } from "../Theme";

export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductListItemProps = {
  product: Tables<'products'>;
}

const { width } = Dimensions.get("window");
const height = (width * 100) / 100 + 13;

const ProductListItem = memo<ProductListItemProps>(({ product }) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/home/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
        />
        <Box
          flex={1}
          borderTopWidth={0.3}
          borderTopColor={"bgSurfaceEmphasis"}
          padding={"s"}
          //marginTop={"s"}
          gap={"s"}
          backgroundColor={"bgSurface"}
          borderBottomLeftRadius={"l"}
          borderBottomRightRadius={"l"}
        >
          <Text style={styles.title}>{product.title}</Text>
          <Text style={{}}>{product.brand}</Text>
          <Text style={styles.price}>
            {formatPrice(product.price as number)}
          </Text>
        </Box>
      </Pressable>
    </Link>
  );
})

export { ProductListItem }; 
  
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    //padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  image: {
    width: '100%',
    //height: height/2,
    aspectRatio: 1,
    // resizeMode: "stretch",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    //marginVertical: 10,
    fontFamily: "airMedium",
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "airMedium",
  },
});