import useFadingAnimation from "@/helpers/useFadingAnimation";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../Theme";
import RoundIconButton from "../RoundIconButton";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  data: Data;
  showIcon?: boolean;
}

type Data = {
  message: string;
  isVisible: boolean;
  hideToast: () => void;
};

export default function Toast({ containerStyle, textStyle, data, showIcon = true }: Props) {
  let { message, isVisible, hideToast } = data;
  let [animatedVisibility, animatedValue] = useFadingAnimation(isVisible, { duration: 200 });
  
  if (!animatedVisibility) {
    return null;
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
      <View
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={
          [styles.container,
            !showIcon && styles.containerNoIcon,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
            containerStyle,
          ] as StyleProp<ViewStyle>
        }
      >
        <Text style={textStyle}>{message}</Text>
        {showIcon && hideToast && (
          <RoundIconButton
            color="background"
            name="x"
            size={35}
            backgroundColor="primary"
            onPress={hideToast}
          />
        )}
      </View>
   </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  container: {
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 5,
    margin: 8,
    height: 48,
    width: '80%',
    paddingLeft: 16,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 40,
  },
  containerNoIcon: {
    paddingLeft: 16,
  },

})
