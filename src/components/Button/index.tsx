import React from "react";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "../Theme";
import { RectButton, RectButtonProperties } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    height: 50,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
});

interface ButtonProps {
  variant?: "default" | "primary";
  label?: string;
  width?: number;
  onPress?: () => void;
  style?: RectButtonProperties["style"];
}

const Button = ({ variant, label, onPress, width, style }: ButtonProps) => {
  const { colors } = useTheme();
  const backgroundColor =
    variant === "primary" ? colors.primary2 : colors.background2;
  const color = variant === "primary" ? colors.background : colors.secondary;

  return (
    <RectButton
      style={[styles.container, style, { backgroundColor, width }]}
      {...{ onPress }}
    >
      <Text variant="title3" style={{ color }}>
        {label}
      </Text>
    </RectButton>
  );
};

Button.defaultProps = { variant: "default" };

export default Button;
