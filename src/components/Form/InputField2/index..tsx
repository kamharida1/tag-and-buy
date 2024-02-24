import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { Box, useTheme } from "../../Theme";
import { forwardRef } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import RoundIcon from "../../RoundIcon";

interface TextInputProps extends RNTextInputProps {
  error?: string;
  touched?: boolean;
  icon: string;
}

const InputField2 = forwardRef<RNTextInput, TextInputProps>(
  ({ error, touched, icon, ...props }, ref) => {
    const theme = useTheme();
    const SIZE = theme.borderRadii.m * 2.5;
    const color = !touched ? "body" : error ? "danger" : "primary";
    const themeColor = theme.colors[color];

    return (
      <Box
        flexDirection="row"
        margin={`l`}
        height={50}
        alignItems="center"
        borderRadius="s"
        borderWidth={StyleSheet.hairlineWidth}
        borderColor={color}
        padding="s"
        //style={{ backgroundColor: theme.colors.secondary }}
      >
        <Box padding="s">
          <Icon name={icon as any} size={20} color={themeColor} />
        </Box>
        <Box flex={1}>
          <RNTextInput
            underlineColorAndroid="transparent"
            placeholderTextColor={themeColor}
            style={{
              fontFamily: "airMedium",
              fontSize: 15,
              color: theme.colors.secondary,
            }}
            {...{ ref }}
            {...props}
          />
        </Box>
        {touched && (
          <RoundIcon
            name={!error ? "check" : "x"}
            size={SIZE}
            backgroundColor={!error ? "primary" : "danger"}
            color="background"
          />
        )}
      </Box>
    );
  }
);

export default InputField2;
