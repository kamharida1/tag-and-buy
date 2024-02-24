import Colors from "@/constants/Colors";
import { Text } from "moti";
import { memo } from "react";
import { StyleSheet, ViewProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.light.tabIconSelected,
    height: 54,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6, 
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});

interface ButtonOutlineT {
  style?: ViewProps["style"];
  onPress?: () => void;
  children: React.ReactNode;  
}

const ButtonOutline = memo<ButtonOutlineT>(({
  style, onPress, children
}) => {
  return (
    <TouchableOpacity style={[{...styles.btnOutline}, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
});

export default ButtonOutline;

