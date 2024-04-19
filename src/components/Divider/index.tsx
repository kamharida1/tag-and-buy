import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { memo } from 'react'
import { AppColors } from '@/utils'

interface DividerProps {
  style?: StyleProp<ViewStyle>
}

const Divider = memo<DividerProps>(({style}) => {
  return <View style={[styles.divider, style]} />;
});

export default Divider

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.DarkGrey,
    marginVertical: 10,
  }
})