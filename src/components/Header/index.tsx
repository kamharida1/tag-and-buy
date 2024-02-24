import { GestureResponderEvent, Pressable, StyleSheet, ViewProps } from "react-native";
import { Text, View } from "react-native";
import tw from 'twrnc'

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
    <View style={styles.pageHeaderContainer}>
      <Pressable
        onPress={handleOnPressLeftNode}
        style={leftContainerStyle || styles.leftItem}
      >
        {leftNode}
      </Pressable>
      <View style={styles.headerItem}>
        <Text style={tw`text-center font-medium text-[17px]`}>
          {headerText}
        </Text>
      </View>
      <Pressable
        onPress={handleOnPressRightNode}
        style={rightContainerStyle || styles.rightItem}
      >
        {rightNode}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeaderContainer: tw.style(
    `flex flex-row justify-between items-center border-b border-gray-200`,
    {
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.05,
      elevation: 3,
    }
  ),
  leftItem: tw`flex-1 pl-4 py-4`,
  rightItem: tw`flex-1 pr-4 items-end py-4`,
  headerItem: tw`flex-1 py-4`,
});

export default Header;