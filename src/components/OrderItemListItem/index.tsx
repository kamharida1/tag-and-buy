import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Tables } from "@/types";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import formatPrice from "@/utils/naira_price";
import Colors from "@/constants/Colors";
import AppText from "../AppText";

type OrderItemListItemProps = {
  item?: { products: Tables<"products"> } & Tables<"order_items">;
  address?: Tables<"addresses">;
};

const OrderItemListItem = ({ item, address }: OrderItemListItemProps) => {
  console.warn("address: ", address);
  return (
    <View style={styles.container}>
      <RemoteImage
        path={item?.products.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <AppText style={styles.title}>{item?.products.title}</AppText>
        <AppText style={styles.quantity}>Qty: {item?.quantity}</AppText>
        <View style={styles.subtitleContainer}>
          <AppText style={styles.price}>
            {formatPrice(item?.products.price || 0)}
          </AppText>
          <AppText style={styles.price}>
            {address?.email || "No address"}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: "gray",
    justifyContent: "space-between",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 5,
    color: "black",
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  quantity: {
    fontWeight: "500",
    fontSize: 12,
    color: "gray",
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default OrderItemListItem;
