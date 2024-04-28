
import { AppColors, isAndroid } from "@/utils";
import React from "react";
import { TAB_ICON_SIZE as CART_ICON_SIZE } from "@/constants";
import  Cart  from "../../../assets/svgs/Cart.svg";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AppText from "../AppText";
import { Ionicons } from "@expo/vector-icons";


type CartButtonWithIndicatorProps = {
  quantity: number;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default ({
  quantity = 0,
  onPress,
  size = CART_ICON_SIZE,
  color = AppColors.PureBlack,
  style,
}: CartButtonWithIndicatorProps): JSX.Element => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {/* <Cart
        stroke={cartIconColor}

        height={CART_ICON_SIZE - 4}
        width={CART_ICON_SIZE - 4}
      /> */}
      <Ionicons name="cart-outline" size={size} color={color} />
      <View style={styles.quantityNumber}>
        <AppText
          color="PureWhite"
          fontFamily="airMedium"
          style={{
            marginTop: isAndroid ? -3 : undefined,
          }}
        >
          {quantity > 9 ? "9+" : quantity}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 26,
    width: 26,
  },
  quantityNumber: {
    height: 18,
    width: 18,
    borderRadius: 100,
    backgroundColor: AppColors.TextCritical,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -9,
    top: -4,
  },
});
