import Header from "@/components/Header";
import KeyboardAvoidingView from "@/components/KeyboardAvoidingView ";
import { Loader } from "@/components/Loader";
import { View } from "moti";
import { memo } from "react";
import { GestureResponderEvent, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

interface AppContainerProps {
  scroll?: boolean;
  header?: boolean;
  leftNode?: JSX.Element ;
  rightNode?: JSX.Element;
  children: React.ReactNode;
  safe?: boolean;
  loading?: boolean;
  headerText?: string;
  style?: ViewProps["style"];
  handleOnPressLeftNode?: (event: GestureResponderEvent) => void;
  handleOnPressRightNode?: (event: GestureResponderEvent) => void;
  rightContainerStyle?: ViewProps["style"] | null;
  leftContainerStyle?: ViewProps["style"] | null;
}
 
const AppContainer = memo<AppContainerProps>(
  ({
    style,
    header,
    safe = false,
    loading = false,
    scroll = false,
    leftNode,
    rightNode,
    headerText = ' ',
    handleOnPressLeftNode,
    handleOnPressRightNode ,
    rightContainerStyle,
    leftContainerStyle,
    children,
  }) => {
    const MyView = safe ? SafeAreaView : View;
    return (
      <KeyboardAvoidingView>
        <MyView style={[styles.container, style]}>
          {loading ? (
            <Loader isLoading={loading} />
          ) : (
            <>
              {scroll ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  {header && (
                    <Header
                      leftContainerStyle={leftContainerStyle}
                      rightContainerStyle={rightContainerStyle}
                      leftNode={leftNode}
                      rightNode={rightNode}
                      headerText={headerText}
                      handleOnPressLeftNode={handleOnPressLeftNode}
                      handleOnPressRightNode={handleOnPressRightNode}
                    />
                  )}
                  <View style={styles.sub}>{children}</View>
                </ScrollView>
                  
              ) : (
                <>
                  {header && (
                    <Header
                      leftContainerStyle={leftContainerStyle}
                      rightContainerStyle={rightContainerStyle}
                      leftNode={leftNode}
                      rightNode={rightNode}
                      headerText={headerText}
                      handleOnPressLeftNode={handleOnPressLeftNode}
                      handleOnPressRightNode={handleOnPressRightNode}
                    />
                  )}
                  <View style={styles.sub}>{children}</View>
                </>
              )}
            </>
          )}
        </MyView>
      </KeyboardAvoidingView>
    );
  })

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
  },
  sub: {
    flex: 1,
   // paddingHorizontal: 8
  }
})