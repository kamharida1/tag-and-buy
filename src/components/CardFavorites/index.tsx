import { View, Text, Image } from "react-native";
import React, { memo } from "react";
import { AnimatePresence } from "moti";
import CardAnimated from "../CardAnimated";
import formatPrice from "../../utils/naira_price";
import { useCartStore } from "@/store";
import { Product } from "@/types";
import { RemoteImage } from "../RemoteImage";
import { StyleSheet } from "react-native";
import { defaultPizzaImage } from "../ProductListItem";
import { ButtonOutline } from "../ButtonOutline";

const CardFavorites = memo(({ product }: { product: Product }) => {
 
const removeFromFavorites = useCartStore(state => state.removeFromFavorites);

const handleRemove = () => {
  removeFromFavorites(product.id)
};

  return (
    <AnimatePresence exitBeforeEnter>
      <CardAnimated>
        <View
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 100,
              height: 200,
              margin: 8,
            }}
          >
            <RemoteImage
              path={product?.image}
              style={StyleSheet.absoluteFill}
              fallback={defaultPizzaImage}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              gap: 5,
              marginVertical: 10,
              marginLeft: 40,
              justifyContent: "center",
              flexWrap: "wrap",
              width: 150,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontWeight: "600",
                fontSize: 16,
                width: 150,
              }}
            >
              {product.title}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "400" }}>
              {product.brand}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {formatPrice(product.price as number)}
            </Text>
            <ButtonOutline
              title="Remove from favorites"
              onPress={handleRemove}
              style={{
                margin: "auto",
                marginTop: 30,
                width: 180,
                borderColor: "red",
              }}
              textStyle={{
                color: "red",
                fontWeight: "600",
                fontSize: 15,
              }}
            />
          </View>
        </View>
      </CardAnimated>
    </AnimatePresence>
  );
});

export { CardFavorites };
