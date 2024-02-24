import { memo } from "react";
import KeyboardShift from "@fullstackcraft/react-native-keyboard-shift/lib/components/KeyboardShift";
import { GestureResponderEvent, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loader } from "../Loader";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  sub: {
    flex: 1,
    //justifyContent: "center",
   padding: 8,
  },
});

interface AppContainerT {
  flatList?: boolean;
  iconLeft?: string;
  onPress?:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
  onPressRight?:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
  iconRight?: string;
  children?: React.ReactNode;
  safe?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const AppContainer = memo<AppContainerT>(
  ({
    flatList = false,
    iconLeft = 'arrow-left',
    onPress,
    onPressRight,
    iconRight,
    children,
    safe,
    style,
    loading = false
  }) => {
    const MyView = safe ? SafeAreaView : View;
    const { container, sub } = styles
  return (
    <KeyboardShift>
      <MyView style={[container, { backgroundColor: "#fff" }, style]}>
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              {!flatList ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                  testID="scrollview-screen"
                  contentInsetAdjustmentBehavior="automatic"
                >
                  <View style={sub}>{children}</View>
                </ScrollView>
              ) : (
                <>
                  <View style={sub}>{children}</View>
                </>
              )}
            </>
          )}
        </>
      </MyView>
    </KeyboardShift>
  );
  })

  export { AppContainer };


