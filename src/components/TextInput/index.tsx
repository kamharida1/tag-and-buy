import React, { Ref, forwardRef, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputFocusEventData,
  TextInputProps as NativeTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Box, useTheme } from '../Theme';
import { create } from '@/utils/normalize';
import Text from '../RestyleComponents/text';
import RoundIcon from '../RoundIcon';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { FormikErrors, FormikValues } from 'formik';
import RoundIconButton from '../RoundIconButton';

type Props = NativeTextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
  errorMessageStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  isPassword?: boolean;
  label?: string;
  field: {
    name: string;
    value: string;
    onChange: any;
    onBlur: (name: string) => void;
    onFocus: (name: string) => void;
  };
  form: {
    errors: { [field: string]: string},
    touched: { [field: string]: boolean},
    setFieldTouched: (
      field: string,
      isTouched?: boolean,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<FormikValues>>
  }
  
  labelStyle?: StyleProp<TextStyle>;
  mode?: "flat" | "outlined";
  ref?: Ref<NativeTextInput>;
  showErrorIcon?: boolean;
};

function TextInput(props: Props, ref: Ref<NativeTextInput>) {
  let {
    field: { name, value, onChange, onBlur, onFocus },
    form: { setFieldTouched, errors, touched },
    isPassword,
    autoCorrect = false,
    containerStyle,
    disabled = false,
    editable = true,
    errorMessage,
    errorMessageStyle,
    label,
    labelStyle,
    mode = 'outlined',
    multiline,
    showErrorIcon = true,
    style,
    keyboardType = 'default',
    ...otherProps
  } = props;

  const [secureTextEntry, setSecureTextEntry ] = useState(false);

  let { colors } = useTheme();

  const AnimatedText = Animated.createAnimatedComponent(Text);

  let [isFocused, setIsFocused] = useState(false);

  const animatedValue = useSharedValue(0);

  const toggleSecureTextEntry = () => { 
    setSecureTextEntry(!secureTextEntry);
  }

  const animatedLabelStyles = useAnimatedStyle(() => {
    const transform = [{
      translateY: interpolate(animatedValue.value, [0, 1], [0, -8], 'clamp')
    }];
    const opacity = interpolate(animatedValue.value, [0, 1], [1, 0.6], 'clamp');
    const fontSize = interpolate(animatedValue.value, [0, 1], [14, 13], 'clamp');
    return {
      transform,
      opacity,
      fontSize,
    }
  })

  let handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (disabled || !editable) {
        return;
      }
      onFocus && onFocus(name);
      animatedValue.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });  
      setIsFocused(true);
    },
    [onFocus, disabled, editable]
  );

  let handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (disabled || !editable) {
        return;
      }
      setFieldTouched(name);
      onBlur && onBlur(name);
      animatedValue.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      setIsFocused(false);
    },
    [onBlur, disabled, editable]
  );

  let handleChangeText = useCallback(
    (text: string) => {
      if (disabled || !editable) {
        return;
      }
      if (
        (keyboardType === "number-pad" || keyboardType === "numeric") &&
        !text.match(/^-?[0-9]*$/)
      ) {
        return;
      }
      onChange && onChange(name)(text);
      // if (onChange && typeof onChange === 'function') {
      //   onChange(name, text);
      // }
    },
    [onChange]
  );

  let isError = errors[name] && touched[name];

  let hasLabel = !!label;

  let getColor = (target: 'border' | 'label') => {
    if (target === 'label') {
      return colors.body;
    }
    if (disabled) {
      return colors.disabled;
    }
    if (isError) {
      return colors.danger;
    }
    if (isFocused) {
      return colors.primary;
    }
    if (target === 'border') {
      return colors.background2;
    }
  };

  let multilineStyle = {
    minHeight: mode === 'outlined' || hasLabel ? 60 : 0,
    height: 'auto',
  } as StyleProp<ViewStyle>;

  let wrapperStyle: StyleProp<ViewStyle> =
    mode === 'outlined'
      ? [
        styles.outlinedContainer,
        {
          borderRadius: 10,
          backgroundColor: disabled ? colors.disabled : colors.background,
          justifyContent: hasLabel ? 'space-between' : 'center'
        },]
      : [
        styles.flatContainer,
        {
          justifyContent: hasLabel ? 'space-between' : 'flex-end',
        },
        hasLabel && { height: 60 },
      ];
  
  return (
    <>
      <Box
        style={[
          { borderColor: getColor("border") },
          multiline && multilineStyle,
          containerStyle,
          ...wrapperStyle,
        ]}
      >
        {hasLabel && (
          <AnimatedText
            variant="body2"
            style={[animatedLabelStyles, styles.label, { color: getColor("label") }]}
          >
            {label}
          </AnimatedText>
        )}
        <NativeTextInput
          value={value}
          ref={ref}
          editable={!disabled && editable}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          autoCapitalize="sentences"
          multiline={multiline}
          secureTextEntry={isPassword && secureTextEntry}
          onFocus={handleFocus}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.disabled}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={[{ color: disabled ? colors.disabled : colors.body }, style]}
          {...otherProps}
        />
        {isPassword && (
          <Box style={{ position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, }}>
            <RoundIconButton
              name={secureTextEntry ? 'eye' : 'eye-off'}
              size={24}
              backgroundColor="background"
              color="textDark"
              onPress={toggleSecureTextEntry}
              iconRatio={0.7}
            />
          </Box>
        )}
        {isError && showErrorIcon && (
          <Box style={styles.errorIconContainer}>
            <RoundIcon
              name="x"
              size={24}
              backgroundColor="danger"
              color="background"
              iconRatio={0.7}
            />
          </Box>
        )}
        {isError && (
          <Text
            variant="body2"
            style={[
              styles.label,
              styles.errorMessage,
              mode === "flat" && { paddingHorizontal: 0 },
              errorMessageStyle,
            ]}
          >
            {errorMessage || errors[name]}
          </Text>
        )}
      </Box>
    </>
  );
 
}
 
const styles = create({
  outlinedContainer: {
    borderWidth: 1,
    paddingVertical: 8,
    padding: 12,
  },
  flatContainer: {
    borderBottomWidth: 1,
    borderColor: 'background2',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12
  },
  errorIconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    //alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorMessage: {
    padding: 12,
    paddingTop: 0,
    marginTop: -5,
    color: '#dd0000'
  }
});

export default forwardRef(TextInput);