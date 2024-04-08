import { useAddress, useDeleteAddress, useEditAddress, useGetSelectedAddress, useInsertAddress, useUpdateAddress } from "@/api/addresses";
import AppText from "@/components/AppText";
import Button from "@/components/Button";
import { ButtonOutline } from "@/components/ButtonOutline";
import Divider from "@/components/Divider";
import FormPlaces from "@/components/FormPlaces";
import KeyboardAvoidingView from "@/components/KeyboardAvoidingView ";
import QuickActionButton from "@/components/QuickActionButton";
import Spacer from "@/components/Spacer";
import Colors from "@/constants/Colors";
import { FlexContainer, PaddingContainer } from "@/containers";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { View } from "moti";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, TextInput } from "react-native";
import tw from "twrnc"

export default function CreateOrEditAddress() {
  const [province, setProvince] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [street2, setStreet2] = useState<string>("");
  const [zip_code, setZipCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { id: idString } = useLocalSearchParams();
  
  const { mutate: insertAddress } = useInsertAddress();
  const { mutate: updateAddress } = useEditAddress();
  const { data: updatingAddress } = useAddress(idString as string);
  const { mutate: deleteAddress } = useDeleteAddress();
  const { data: selectedAddress } = useGetSelectedAddress();
  const { mutate: selectAddress } = useUpdateAddress();

  const isUpdating = !!idString;
  const { userId } = useAuth();

  const updaterAddress = async (addressId: string) => {
    if (selectedAddress?.is_selected) {
      selectAddress({
        id: selectedAddress.id,
        updatedFields: { is_selected: false },
      });
    }
    selectAddress({
      id: addressId,
      updatedFields: { is_selected: true },
    });
  };

  const getInfo = (province: any, town: any) => {
    setProvince(province);
    setTown(town);
  };

  useEffect(() => {
    if (isUpdating && updatingAddress) {
      setFirstName(updatingAddress.first_name || "");
      setLastName(updatingAddress.last_name || "");
      setEmail(updatingAddress.email || "");
      setPhone(updatingAddress.phone || "");
      setStreet(updatingAddress.street || "");
      setStreet2(updatingAddress.street2 || "");
      setZipCode(updatingAddress.zip_code || "");
      setTown(updatingAddress.city || "");
      setProvince(updatingAddress.state || "");
    }
  }, [updatingAddress, isUpdating]);

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setStreet("");
    setStreet2("");
    setZipCode("");
    setTown("");
    setProvince("");
  };

  const onSubmit = () => {
    if (isUpdating) {
      // update
      onUpdate();
    } else {
      // create
      onCreate();
    }
  };

  const onCreate = () => {
    const address = {
      first_name,
      last_name,
      email,
      phone,
      street,
      street2,
      zip_code,
      city: town,
      state: province,
      user_id: userId,
    };
    insertAddress(address, {
      onSuccess: () => {
        alert("Address created successfully");
        resetFields();
        router.back();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

   const onUpdate = () => {
     updateAddress(
       {
         id: idString as string,
         first_name,
         last_name,
         email,
         phone,
         street,
         street2,
         zip_code,
         city: town,
         state: province,
         user_id: userId,
       },
       {
         onSuccess: () => {
           alert("Address updated successfully");
           resetFields();
           router.back();
         },
         onError: (error: any) => {
           alert(error.message);
         },
       }
     );
   };
  
  const onDelete = () => {
    deleteAddress(idString as string, {
      onSuccess: () => {
        alert("Address deleted successfully");
        resetFields();
        router.back();
      },
      onError: (error: any) => {
        alert(error.message);
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };
  
  return (
    <SafeAreaView style={tw`flex-1`}>
      <KeyboardAvoidingView>
        {/* header */}
        <PaddingContainer style={tw`py-0`}>
          <FlexContainer position="start" direction="row">
            <QuickActionButton onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </QuickActionButton>
            <Spacer space={50} between />
            <AppText fontFamily="airBold" style={tw`text-xl font-bold`}>
              {updatingAddress ? "Edit Address" : "Add a New Address"}
            </AppText>
          </FlexContainer>
        </PaddingContainer>
        <Divider />
        {/* body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={tw`p-4 border border-gray-200 flex-1 bg-gray-100`}
        >
          <View style={tw`p-4 bg-white border border-gray-200  `}>
            <AppText style={tw``}>First Name</AppText>
            <TextInput
              value={first_name}
              onChangeText={setFirstName}
              placeholder="First Name"
              style={tw`h-12 border bg-zinc-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}> Last Name</AppText>
            <TextInput
              value={last_name}
              onChangeText={setLastName}
              placeholder="Last Name"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}>Email</AppText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}>Phone</AppText>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}>Street</AppText>
            <TextInput
              value={street}
              onChangeText={setStreet}
              placeholder="Street"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}>Street 2</AppText>
            <TextInput
              value={street2}
              onChangeText={setStreet2}
              placeholder="Street 2"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />
            <AppText style={tw``}>Zip Code</AppText>
            <TextInput
              value={zip_code}
              onChangeText={setZipCode}
              placeholder="Zip Code"
              style={tw`h-12 border bg-gray-200 my-4 rounded-md border-gray-300 px-4`}
            />

            <FormPlaces getInfo={getInfo} />

            <Button
              onPress={onSubmit}
              label={isUpdating ? "Update" : "Create"}
            />
            {isUpdating && (
              <ButtonOutline
                onPress={confirmDelete}
                title="Delete"
                textStyle={tw`text-center text-red-500 text-base`}
                style={{
                  height: 50,
                  //borderRadius: 20,
                  width: "100%",
                  marginVertical: 7,
                  borderWidth: 0.0,
                }}
              />
            )}
          </View>
          <Spacer space={10} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}