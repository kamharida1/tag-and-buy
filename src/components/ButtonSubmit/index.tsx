import React from "react";
import {  TextProps, ViewProps, ViewStyle } from "react-native";
import { useFormikContext } from "formik";
import { Text } from "moti";
import { MotiPressable } from "moti/interactions";
import { defaultStyles } from "@/constants/Styles";
import { Loader } from "../Loader";

interface AppFormSubmitButtonProps {
  title: string;
  style?: ViewProps["style"];
  loading?: boolean;
  textStyle?: TextProps["style"];
}
const ButtonSubmit = ({
  title,
  loading,
  style,
  textStyle,
}: AppFormSubmitButtonProps) => {
  const { handleSubmit, isValid } = useFormikContext();
  // return <Button  onPress={() => handleSubmit()} title={title} disabled={!isValid} />;
  return (
    <MotiPressable
      style={[
        {
          ...defaultStyles.btn,
        },
        style,
      ]}
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "timing",
        duration: 500,
      }}
      onPress={() => handleSubmit()}
      //disabled={(!isValid && disabled)}
    >
      {loading && <Loader />}
     {!loading && <Text style={[defaultStyles.btnText, textStyle]}>{title}</Text>}
    </MotiPressable>
  );
};
export { ButtonSubmit };
