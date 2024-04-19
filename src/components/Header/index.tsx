import { GestureResponderEvent, Pressable, StyleSheet, ViewProps } from "react-native";
import { View } from "react-native";
import tw from 'twrnc'
import { Text } from "../Theme";
import AppText from "../AppText";
import Divider from "../Divider";

type HeaderProps = {
  leftNode?: JSX.Element;
  rightNode?: JSX.Element;
  headerText?: string;
  handleOnPressLeftNode?: (event: GestureResponderEvent) => void;
  handleOnPressRightNode?: (event: GestureResponderEvent) => void;
  rightContainerStyle?: ViewProps["style"] | null;
  leftContainerStyle?: ViewProps["style"] | null;
};

const Header: React.FC<HeaderProps> = ({
  leftNode = null,
  rightNode = null,
  headerText = ' ',
  handleOnPressLeftNode = null,
  handleOnPressRightNode = null,
  rightContainerStyle = null,
  leftContainerStyle = null,
}) => {
  return (
    <>
      <View style={styles.pageHeaderContainer}>
        <Pressable
          onPress={handleOnPressLeftNode}
          style={leftContainerStyle || styles.leftItem}
        >
          {leftNode}
        </Pressable>
        <View style={styles.headerItem}>
          <AppText
            fontFamily="airBold"
            numberOfLines={0}
            style={tw`font-bold text-[18px]`}
          >
            {headerText}
          </AppText>
        </View>
        <Pressable
          onPress={handleOnPressRightNode}
          style={rightContainerStyle || styles.rightItem}
        >
          {rightNode}
        </Pressable>
      </View>
      <Divider style={tw`mt-0 mb-0`} />
    </>
  );
}

const styles = StyleSheet.create({
  pageHeaderContainer: tw.style(`flex gap-8 flex-row  items-center `, {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.05,
    elevation: 3,
    backgroundColor: "transparent",
  }),
  leftItem: tw` pl-4 pb-4`,
  rightItem: tw`pr-5  pb-4`,
  headerItem: tw`pb-4 flex-1 items-center justify-center`,
});

export default Header;