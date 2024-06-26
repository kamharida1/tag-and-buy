import { Alert, FlatList, Linking, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Link, Stack, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeleteAddress, useGetSelectedAddress, useMyAddressList, useUpdateAddress } from '@/api/addresses';
import { Loader } from '@/components/Loader';
import tw from 'twrnc'
import { FlexContainer, PaddingContainer } from '@/containers';
import QuickActionButton from '@/components/QuickActionButton';
import { AntDesign } from '@expo/vector-icons';
import Spacer from '@/components/Spacer';
import AppText from '@/components/AppText';
import Divider from '@/components/Divider';
import { AppColors } from '@/utils';
import { ButtonOutline } from '@/components/ButtonOutline';
import { Tables } from '@/database.types';

export default function Addresses() {
  const { data: addresses, error, isLoading } = useMyAddressList();
  const { data: selectedAddress, } = useGetSelectedAddress();
  const { mutate: selectAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();

  const [isEnabled, setIsEnabled] = useState(selectedAddress ? true : false);
  
  const toggleSwitch = (id: string) => {
    if (id) setIsEnabled((previousState) => !previousState);
  };
  
 const updateAddress = async (address: Tables<"addresses">) => {
   const updatedAddresses = addresses?.map((addr) => {
     if (addr.id === address.id) {
       return { ...addr, is_selected: true };
     }
     return { ...addr, is_selected: false };
   });

   selectAddress(updatedAddresses as Tables<"addresses">[]),
     {
       onSuccess: () => {
         console.log("Address updated successfully");
       },
       onError: (error: any) => {
         console.log("Error updating address", error);
       },
     };
 };

  const onDelete = (addressId: string) => {
    deleteAddress(addressId, {
      onSuccess: () => {
        alert("Address deleted successfully");
        //router.back();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

  const confirmDelete = (addressId: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this address", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(addressId),
      },
    ]);
  };


  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }
  if (error) {
    return <Text>Failed to fetch addresses</Text>;
  }
  return (
    <SafeAreaView style={tw`flex-1`}>
      <PaddingContainer style={tw`py-0`}>
        <FlexContainer position="start" direction="row">
          <QuickActionButton onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </QuickActionButton>
          <Spacer space={100} between />
          <AppText fontFamily="airBold" style={tw`text-2xl font-bold`}>
            Addresses
          </AppText>
        </FlexContainer>
      </PaddingContainer>
      <Divider />
      <FlatList
        contentContainerStyle={tw`p-4`}
        data={addresses || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={tw.style({
              "bg-green-100": selectedAddress?.id === item.id,
              padding: 10,
            })}
          >
            <FlexContainer position="start" direction="row">
              <AppText fontFamily="airBold" style={tw`text-base`}>
                {item.first_name} {item.last_name}
              </AppText>
            </FlexContainer>
            <AppText fontFamily="airMedium" style={tw`text-sm text-gray-900`}>
              {item.street} {`\n`}
              {item.street2}
            </AppText>
            <AppText fontFamily="airMedium" style={tw`text-sm  text-gray-800`}>
              {item.city}, {item.state}
            </AppText>
            <AppText fontFamily="airMedium" style={tw`text-sm  text-gray-700`}>
              {item.zip_code}
            </AppText>
            <FlexContainer style={tw`mt-4`} position="rowBetween">
              {/* <ButtonOutline
                title={selectedAddress?.id === item.id ? "Selected" : "Select"}
                onPress={() => updateAddress(item.id)}
                textStyle={tw.style({
                  "text-center": true,
                  "text-blue-900": selectedAddress?.id === item.id,
                  "text-red-500": selectedAddress?.id !== item.id,
                  "text-base": true,
                })}
                style={tw.style(
                  selectedAddress?.id === item.id ? "bg-blue-100" : "bg-red-100"
                )}
              /> */}
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => updateAddress(item)}
                value={selectedAddress?.id === item.id}
              />
              <FlexContainer position="end" direction="row">
                <QuickActionButton onPress={() => {
                  toggleSwitch(item.id)
                  updateAddress(item);
                }}>
                  <AntDesign
                    name={
                      selectedAddress?.id === item.id
                        ? "checkcircle"
                        : "checkcircleo"
                    }
                    size={24}
                    color={AppColors.DarkGreen}
                  />
                </QuickActionButton>
                <Spacer space={10} between />
                <QuickActionButton onPress={() => confirmDelete(item.id)}>
                  <AntDesign name="delete" size={24} color="black" />
                </QuickActionButton>
                <Spacer space={10} between />
                <QuickActionButton
                  onPress={() =>
                    router.push(`/addresses/add_or_edit?id=${item.id}`)
                  }
                >
                  <AntDesign name="edit" size={24} color="black" />
                </QuickActionButton>
              </FlexContainer>
            </FlexContainer>
            <Divider />
          </View>
        )}
        ListFooterComponent={
          <Link href={`/addresses/add_or_edit`} asChild>
            <Pressable>
              <View style={tw`py-4 items-center bg-gray-200 rounded-lg`}>
                <AppText
                  fontFamily="airBold"
                  style={tw`text-[15px] text-sky-600`}
                >
                  Add New Address
                </AppText>
              </View>
            </Pressable>
          </Link>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({})