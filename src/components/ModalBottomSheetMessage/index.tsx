import React from "react";
import { Image, StyleSheet, View } from "react-native";

import DoneIcon from "../../../assets/svgs/DoneIcon.svg"
import ErrorIcon from "../../../assets/svgs/ErrorIcon.svg"
import AppText from "../AppText";
import AppButton from "../AppButton";
import { AppColors } from "@/utils";

type Props = {
  isError: boolean;
  message: string;
  onPressModalButton?: () => void;
  buttonText?: string;
};

export default function ModalBottomSheetMessage(props: Props) {
  let { isError, message, onPressModalButton, buttonText } = props;
  return (
    <>
      <View style={styles.iconContainer}>
        {isError ? (
          <ErrorIcon style={styles.image} />
        ) : (
          <DoneIcon style={{width: 40, height: 40}} />
        )}
      </View>
      <AppText style={styles.message}>{message}</AppText>
      {onPressModalButton ? (
        <AppButton style={styles.buttonStyle} onPress={onPressModalButton}>
          <AppText  style={styles.buttonText}>
            {buttonText ?  buttonText  :  isError? "Try Again": "Ok" }
          </AppText>
        </AppButton>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 84,
    height: 84,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  textInput: {
    marginTop: 8,
  },
  message: {
    textAlign: "center",
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  buttonText: {
    color: AppColors.PureWhite,
    fontSize: 17,
    textTransform: "uppercase",
  },
});
