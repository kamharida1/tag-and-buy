import { MotiView, Text, View } from "moti";
import { memo, useCallback, useState } from "react";
import { NativeSyntheticEvent, Pressable, TextInput, TextInputFocusEventData } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RoundIcon from "../RoundIcon";
import { useTheme } from "../Theme";

const InputField = memo((props: any) => {
  const theme = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {
    placeholder,
    icon,
    isPassword,
    field: { name, onBlur, onFocus, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  const toggleSecureTextEntry = () => {
    setSecureTextEntry((prevState) => !prevState);
  };

  let [isFocused, setIsFocused] = useState(false);

  const SIZE = theme.borderRadii.m * 2;
 
  const hasError = errors[name] && touched[name];
  return (
    <>
      <MotiView
        //animate={{opacity: 1}}
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          borderWidth: 1,
          borderColor: hasError ? "red" : isFocused ? "primary" : "#ABABAB",
          borderRadius: 20,
          padding: 15,
          marginBottom: 15,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={25}
            color="black"
            style={{
              left: 15,
              right: 10,
              position: "absolute",
              zIndex: 1,
            }}
          />
        )}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={(text) => onChange(name)(text)}
          onBlur={() => {
            setFieldTouched(name);
            onBlur(name);
          }}
          secureTextEntry={isPassword && secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
          style={{ flex: 1, fontFamily: "airRegular", fontSize: 15 }}
        />
        {isPassword && !touched[name] && (
          <Pressable
            style={{
              position: "absolute",
              right: 10,
              top: 14,
              zIndex: 1,
            }}
            onPress={toggleSecureTextEntry}
          >
            <Ionicons
              name={secureTextEntry ? "md-eye-off" : "md-eye"}
              size={25}
              color="black"
            />
          </Pressable>
        )}
        {touched[name] && (
          <RoundIcon
            name={!hasError ? "check" : "x"}
            size={SIZE}
            backgroundColor={!hasError ? "primary" : "danger"}
            color="background"
          />
        )}
      </MotiView>
      {hasError && (
        <Text style={{ color: "red", marginBottom: 12 }}>{errors[name]}</Text>
      )}
    </>
  );
});

export { InputField };
