import { MotiView } from "moti";
import React, { Component, ReactNode } from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

class CardAnimated extends Component<CardProps> {
  render() {
    // Component logic goes here
    const { style, children } = this.props;
    return (
      <MotiView
        from={{
          opacity: 0,
          scale: 0.2,
        }}
        animate={{
          opacity: 1,
          scale: 0.97,
        }}
        exit={{
          opacity: 0,
          scale: 0,
        }}
        exitTransition={{
          type: "spring",
          //duration: 2500,
        }}
        style={[styles.card, style]}
      >
        {children}
      </MotiView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
    shadowRadius: 7,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default CardAnimated;
