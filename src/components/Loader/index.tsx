import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,1)",
  },
});

interface LoaderT {
  size?: number | "small" | "large";
  animating?: boolean;
  color?: string;
}

const Loader = memo<LoaderT>(({ size, animating, color }) => {
  const { activityIndicator } = styles;
  return (
    <View style={activityIndicator}>
        {!animating && <ActivityIndicator size={size} color={color} />}
      </View>
  );
});

export { Loader };
