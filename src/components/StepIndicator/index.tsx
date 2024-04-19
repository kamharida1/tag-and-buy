import { StyleSheet, View } from 'react-native'
import React from 'react'
import AppText from '../AppText';
import tw from 'twrnc';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

interface StepIndicatorT { 
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorT) {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];

  const renderItem = ({ item }: { item: { index: number; title: string; content: string } }) => { 
    const { index, title } = item;
    const isCurrentStep = currentStep === index;
    return (
      <View
        key={index}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {index > 0 && (
          <View
            style={[
              { flex: 1, height: 1, backgroundColor: "green" },
              index <= currentStep && { backgroundColor: "green" },
            ]}
          />
        )}
        <View
          style={[
            tw`rounded-full w-7 h-7 items-center justify-center bg-neutral-200`,
            index < currentStep && tw`bg-green-700`,
          ]}
        >
          {index < currentStep ? (
            <AppText style={tw`text-lg font-bold text-white`}>
              {/* <Ionicons name="checkmark" size={24} color="black" /> */}
              &#10003;
            </AppText>
          ) : (
              <AppText>
                {index + 1}
            </AppText>
          )}
        </View>
        <AppText style={tw`text-xs mt-1`}>{title}</AppText>
      </View>
    );
  }

  return (
   <FlatList 
      data={steps.map((step, index) => ({...step, index}))}
      renderItem={renderItem}
      keyExtractor={item => item.index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`flex-row items-center justify-between w-full px-4 py-2 bg-white`}
   />
  )
};