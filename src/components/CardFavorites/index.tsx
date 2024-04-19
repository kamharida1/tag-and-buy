import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
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
import AppText from "../AppText";
import { router } from "expo-router";
import { useCart } from "@/providers/CartProvider";

const CardFavorites = memo(({ product }: { product: Product }) => {
 
  const { deleteItem } = useCart();
  const handleRemove = () => {
    if(product) deleteItem(product)
  };  

  return (
    <AnimatePresence exitBeforeEnter>
      <CardAnimated>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(user)/home/[id]', params: { id: product?.id } })}
          style={{
            //marginHorizontal: 7,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              margin: 8,
              borderRadius: 10,
              overflow: "hidden",
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
              width: 250,
            }}
          >
            <AppText
              fontFamily="airMedium"
              numberOfLines={2}
              style={{
                fontWeight: "600",
                fontSize: 17,
                width: 250,
              }}
            >
              {product.title}
            </AppText>
            <AppText style={{ fontSize: 14, fontWeight: "400" }}>
              {product.brand}
            </AppText>
            <AppText style={{ fontSize: 18, fontWeight: "600" }}>
              {formatPrice(product.price as number)}
            </AppText>
            <ButtonOutline
              title="Remove from favorites"
              onPress={handleRemove}
              style={{
                margin: "auto",
                marginTop: 20,
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
        </TouchableOpacity>
      </CardAnimated>
    </AnimatePresence>
  );
});

export { CardFavorites } ;
