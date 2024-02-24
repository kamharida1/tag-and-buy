import React from "react";
import { BorderlessButton } from "react-native-gesture-handler";
import RoundIcon, { RoundIconProps } from "../RoundIcon";
import { StyleProp,  ViewStyle } from "react-native";

interface RoundIconButtonProps extends RoundIconProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const RoundIconButton = ({ onPress, style, ...props }: RoundIconButtonProps) => {
  return (
    <BorderlessButton {...{ onPress, style }}>
      <RoundIcon {...props} />
    </BorderlessButton>
  );
};

RoundIconButton.defaultProps = { ...RoundIcon.defaultProps };

export default RoundIconButton;
