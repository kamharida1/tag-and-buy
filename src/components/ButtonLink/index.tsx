import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from '../AppText'
import { AppColors } from '@/utils';
import tw from 'twrnc'

interface ButtonLinkT{
  title: string;
  onPress: () => void;
  disabled?: boolean
}

export default function ButtonLink({title, onPress, disabled}: ButtonLinkT) {
  return (
    <TouchableOpacity style={tw`items-center justify-center p-4`} onPress={onPress}>
      <AppText style={{color: disabled ? '#ccc' : AppColors.PrimaryGreen}}>
        {title}
      </AppText>
   </TouchableOpacity>
  )
}