import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "@/types";
import { AppColors } from "@/utils";
import formatPrice from "@/utils/naira_price";
import AppText from "../AppText";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";

type OrderItemListItemProps = {
  item?: { products: Tables<"products"> } & Tables<"order_items">;
  address?: Tables<"addresses">;
  isLastProduct: boolean;
};

const BasicProductList = ({ item, isLastProduct }: OrderItemListItemProps) => {
  return (
    <View style={[
      styles.container,
      {
        borderBottomLeftRadius: isLastProduct ? 10 : 0,
        borderBottomRightRadius: isLastProduct ? 10 : 0
      }]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.IconContainer}>
          {/* <Ionicons name="square" size={30} color={AppColors.FaceBookGrey} /> */}
          <RemoteImage
            path={item?.products.image}
            fallback={defaultPizzaImage}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.productInfoContainer}>
          <AppText fontFamily="airMedium" style={styles.secondaryText}>
            {item?.products.title}
          </AppText>
          <AppText>x{item?.quantity}</AppText>
        </View>
      </View>
      <View>
        <AppText style={styles.primaryText}>
          {formatPrice(
            (item?.products.price as number) * (item?.quantity as number)
          )}
        </AppText>
      </View>
    </View>
  );
};

export default BasicProductList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: AppColors.PureWhite,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.Grey,
    padding: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 40,
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 5,
    overflow: "hidden",
    //marginRight: 10,
  },
  productInfoContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  IconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.Grey,
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.PrimaryGreen,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
