import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/utils'

const Divider = () => {
  return (
   <View style={styles.divider} />
  )
}

export default Divider

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: AppColors.DarkGrey,
    marginVertical: 10,
  }
})