import React from "react";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { Box, Text, Theme } from "../Theme";


export interface RoundIconProps {
  name: string;
  size: number;
  color: keyof Theme["colors"];
  backgroundColor: keyof Theme["colors"];
  iconRatio: number;
  align: "center" | "flex-start" | "flex-end";
}

const RoundIcon = ({
  name,
  size = 30,
  color,
  backgroundColor,
  iconRatio,
  align,
}: RoundIconProps) => {
  const iconSize = size * iconRatio;

  return (
    <Box
      height={size}
      width={size}
      padding="m"
      justifyContent="center"
      alignItems={align}
      style={{ borderRadius: size / 2 }}
      {...{ backgroundColor }}
    >
      <Text style={{ width: iconSize, height: iconSize }} {...{ color }}>
        <Icon color={color} size={iconSize} {...({ name } as any)} />
      </Text>
    </Box>
  );
};

RoundIcon.defaultProps = {
  iconRatio: 0.7,
  align: "center",
};

export default RoundIcon;
