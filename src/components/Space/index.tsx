import React, { memo } from "react";
import { Text } from "react-native";
import { View } from "react-native";

interface SpaceT {
  height?: number;
}

const Space = memo<SpaceT>(({ height }) => {
  return (
      <View
        style={{
          height: height || 20,
        }}
      />
  );
});

export { Space };
