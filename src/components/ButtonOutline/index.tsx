import { Text, Pressable, ViewStyle, TextStyle } from "react-native";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import AppText from "../AppText";

const ButtonOutline = memo(
  ({
    title,
    onPress,
    style,
    textStyle,
    children,
  }: {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
  }) => {
    return (
      <>
        <Pressable onPress={onPress} style={[styles.container, style]}>
          <AppText fontFamily="airBold" style={[styles.text, textStyle]}>
            {title}
          </AppText>
          {children}
        </Pressable>
      </>
    );
  }
);

export { ButtonOutline };

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 5,
    borderColor: "#666",
    borderWidth: 0.6,
    minWidth: 150,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#888",
    //textAlign: "center",
  },
});
