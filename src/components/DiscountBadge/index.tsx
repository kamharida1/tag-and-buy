import { Text, View } from "@/components/Themed";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  value: number;
};

export default function DiscountBadge({
  containerStyle,
  textStyle,
  value,
  ...otherProps
}: Props) {
  let discount = Math.round(value);
  return (
    <View
      style={[
        containerStyle,
        {
          padding: 5,
          backgroundColor: "rgb(255, 0, 0)",
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Text style={[textStyle, { color: "white" }]}>{discount}% OFF</Text>
    </View>
  );
}
