import React from "react";
import { Animated, Modal, StyleSheet, View } from "react-native";

import { ScreenSize, useDimensions } from "@/helpers/dimensions";
import { useKeyboardListener } from "@/helpers/keyboardListener";
import AppText from "../AppText";
import { AppColors, FontSizes } from "@/utils";

type Props = {
  isModalVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
} & HeaderProps;

type HeaderProps = {
  title: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
};

function ModalHeader(props: HeaderProps) {
  let { title, headerLeft, headerRight } = props;
  return (
    <View style={styles.modalHeader}>
      <View style={styles.headerLeft}>{headerLeft}</View>
      <AppText style={styles.modalTitle}>{title}</AppText>
      <View style={styles.headerRight}>{headerRight}</View>
    </View>
  );
}

export default function ModalBottomSheet(props: Props) {
  let { screenSize } = useDimensions();

  let {
    isModalVisible,
    onClose,
    title,
    headerLeft,
    headerRight,
    width = 400,
    height = 320,
    children,
  } = props;

  let { keyboardHeight } = useKeyboardListener();

  let modalStyle = () => {
    if (screenSize === ScreenSize.Small) {
      return styles.modalPhone;
    } else {
      return [styles.modalTablet, { width, height }];
    }
  };

  let animatedViewStyle = () => {
    if (screenSize === ScreenSize.Small) {
      return [
        {
          transform: [
            {
              translateY: Animated.multiply(keyboardHeight, -1),
            },
          ],
        },
      ];
    } else {
      return [styles.modalTablet, { width, height }];
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      onDismiss={onClose}
      animationType="slide"
      transparent={true}
    >
      <Animated.View style={styles.modelContent}>
        <ModalHeader
          title={title}
          headerLeft={headerLeft}
          headerRight={headerRight}
        />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modelContent: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 100,
    elevation: 5,
    height: "30%",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: "absolute",
    bottom: 0,
  },
  modalPhone: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTablet: {
    borderRadius: 8,
    alignSelf: "center",
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.LightGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontFamily: "airMedium",
    fontSize: FontSizes.large,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
});
