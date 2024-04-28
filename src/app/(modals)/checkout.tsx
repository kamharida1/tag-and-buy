import {
  useDeleteAddress,
  useGetSelectedAddress,
  useMyAddressList,
  useUpdateAddress,
} from "@/api/addresses";
// import { useCart } from "@/providers/CartProvider";
import { CartItem, InsertTables, Tables } from "@/types";
import formatPrice from "@/utils/naira_price";
import { AntDesign, Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Paystack } from "react-native-paystack-webview";
import { Text, View } from "moti";
import { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated";
import  Button  from "@/components/Button";
import Space  from "@/components/Spacer";
import { supabase } from "@/lib/supabase";
import tw from "twrnc";
import provinces from "@/data/provinces-data";
import { useCartStore } from "@/store";
import { useInsertOrder } from "@/api/orders";
import { useInsertOrderItems } from "@/api/order-items";
import AppContainer from "@/containers/AppContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/components/AppText";
import { FlexContainer, PaddingContainer } from "@/containers";
import QuickActionButton from "@/components/QuickActionButton";
import { getProductWeight } from "@/api/products";
import { useCart } from "@/providers/CartProvider";
import { TouchableOpacity } from "react-native";
import { AppColors } from "@/utils";
import { ButtonSubmit } from "@/components/ButtonSubmit";
import AppButton from "@/components/AppButton";

export default function ConfirmOrder() {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];

  const { total, checkout, avgShippingCost, isCheckoutInProgress } = useCart();
  
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  
  const { data: selectedAddress } = useGetSelectedAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { data: addresses } = useMyAddressList();
  const { mutate: selectAddress } = useUpdateAddress();

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

  const pay = () => (
    <View style={{ paddingTop: 60, backgroundColor: "#888" }}>
      <Paystack
        amount={total}
        paystackKey="pk_test_e10dba7e643757aaf5a1280e8d4c4538fb6318a8"
        billingEmail="test@gmail.com"
        billingName={
          selectedAddress?.first_name + " " + selectedAddress?.last_name
        }
        channels={["card", "bank", "ussd", "qr", "mobile_money"]}
        onCancel={(e) => {
          alert("Payment Error ");
          console.log(e);
        }}
        onSuccess={(e) => {
          alert("Payment Successful");
          checkout();
          console.log(e);
        }}
        autoStart={true}
      />
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Stack.Screen options={{ title: "Confirm Order" }} />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Animated.View
          style={{
            height: 50,
            width: "100%",
            paddingTop: 10,
            marginBottom: 20,
          }}
        >
          <FlexContainer direction="row" position="start">
            <QuickActionButton
              onPress={() => router.canGoBack() && router.back()}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </QuickActionButton>
            <Space space={20} between />
            <AppText fontFamily="airMedium" fontSize="extraLarge">
              Checkout
            </AppText>
          </FlexContainer>
        </Animated.View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {steps?.map((step, index) => (
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
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <AppText
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    &#10003;
                  </AppText>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <AppText
                fontFamily="airMedium"
                style={{ textAlign: "center", marginTop: 8 }}
              >
                {step.title}
              </AppText>
            </View>
          ))}
        </View>
      </SafeAreaView>

      {currentStep === 0 && (
        <Animated.View style={{ marginHorizontal: 20 }}>
          <AppText
            fontFamily="airBold"
            style={{ fontSize: 20, fontWeight: "bold" }}
          >
            Select Delivery Address
          </AppText>

          <Pressable>
            {addresses?.map((address, index) => (
              <Pressable
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: "#D0D0D0",
                  backgroundColor: "white",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
              >
                {selectedAddress && selectedAddress.id === address?.id ? (
                  <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                ) : (
                  <Entypo
                    onPress={() => updateAddress(address)}
                    name="circle"
                    size={20}
                    color="#D0D0D0"
                  />
                )}

                <View style={{ marginLeft: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <AppText
                      fontFamily="airBold"
                      style={{ fontSize: 16, fontWeight: "bold" }}
                    >
                      {address?.first_name} {address?.last_name}
                    </AppText>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <AppText style={{ fontSize: 15, color: "#777" }}>
                    {address?.street}, {address?.street2}
                  </AppText>
                  <AppText style={{ fontSize: 15, color: "#777" }}>
                    {address?.city}, {address?.state}
                  </AppText>
                  <AppText style={{ fontSize: 15, color: "#777" }}>
                    phone No : {address?.phone}
                  </AppText>
                  <AppText style={{ fontSize: 15, color: "#777" }}>
                    pin code : {address?.zip_code}
                  </AppText>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: "#F5F5F5",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: "#D0D0D0",
                      }}
                    >
                      <AppText> Edit </AppText>
                    </Pressable>

                    <TouchableOpacity
                      onPress={() => confirmDelete(address?.id)}
                      style={{
                        backgroundColor: "#F5F5F5",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: "#D0D0D0",
                      }}
                    >
                      <AppText> Remove </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => updateAddress(address)}
                      style={{
                        backgroundColor: "#F5F5F5",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: "#D0D0D0",
                      }}
                    >
                      <AppText> Set as Default </AppText>
                    </TouchableOpacity>
                  </View>

                  <View>
                    {selectedAddress && selectedAddress.id === address?.id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: "#008397",
                          padding: 10,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <AppText
                          fontFamily="airMedium"
                          style={{ textAlign: "center", color: "white" }}
                        >
                          Deliver to this Address
                        </AppText>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </Animated.View>
      )}

      {currentStep === 1 && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{ marginHorizontal: 20 }}
        >
          <Animated.Text
            entering={FadeInLeft.duration(100).delay(300)}
            style={{ fontSize: 20, fontFamily: "airBold" }}
          >
            Choose your delivery options
          </Animated.Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              marginTop: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <AppText style={{ flex: 1 }}>
              <AppText style={{ color: "green", fontWeight: "500" }}>
                Tomorrow by 10pm
              </AppText>{" "}
              - Free delivery with your Prime membership
            </AppText>
          </View>

          <Pressable
            onPress={() => {
              if (option) {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                }
              } else {
                alert(
                  "Please select an option before moving to the next step."
                );
              }
            }}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <AppText fontFamily="airMedium" style={tw`text-base font-semibold`}>
              Continue
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              }
            }}
            style={{
              // backgroundColor: AppColors.Grey,
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            <AppText fontFamily="airMedium" style={tw`text-base text-teal-600`}>
              Go back
            </AppText>
          </Pressable>
        </Animated.View>
      )}

      {currentStep === 2 && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          style={{ marginHorizontal: 20 }}
        >
          <AppText style={{ fontSize: 20, fontFamily: "airBold" }}>
            Select your Payment Method
          </AppText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              marginTop: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
            }}
          >
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <AppText>Cash on Delivery</AppText>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              marginTop: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
            }}
          >
            {selectedOption === "card" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption("card");
                  Alert.alert("Debit card", "Pay Online", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    { text: "OK", onPress: () => pay() },
                  ]);
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <AppText>Credit or debit card </AppText>
          </View>
          <Pressable
            onPress={() => {
              if (selectedOption) {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                }
              } else {
                alert(
                  "Please select an option before moving to the next step."
                );
              }
            }}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              paddingVertical: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <AppText fontFamily="airMedium" style={tw`text-base font-medium`}>
              Continue
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              }
            }}
            style={{
              // backgroundColor: AppColors.Grey,
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            <AppText fontFamily="airMedium" style={tw`text-base text-teal-600`}>
              Go back
            </AppText>
          </Pressable>
        </Animated.View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <Animated.View
          entering={FadeInUp.duration(500)}
          style={{ marginHorizontal: 20 }}
        >
          <AppText style={{ fontSize: 20, fontFamily: "airBold" }}>
            Order Now
          </AppText>
          <View
            style={tw`bg-white flex-row justify-between rounded-md p-4 border border-gray-300 mt-4`}
          >
            <View>
              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 17, fontWeight: "bold" }}
              >
                Save 5% and never run out
              </AppText>
              <AppText style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Get regular delivery of this item and save 5.0%{" "}
              </AppText>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View style={tw`bg-white rounded-md p-4 border border-gray-300 mt-4`}>
            <AppText fontFamily="airMedium">
              Shipping to {selectedAddress?.first_name}
            </AppText>

            <View style={tw`flex-row justify-between mt-4`}>
              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 16, fontWeight: "500", color: "gray" }}
              >
                Items
              </AppText>

              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 16, fontWeight: "500", color: "gray" }}
              >
                {formatPrice(total)}
              </AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
                alignItems: "center",
              }}
            >
              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 16, fontWeight: "500", color: "gray" }}
              >
                Delivery
              </AppText>

              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 16, color: "gray" }}
              >
                {formatPrice(avgShippingCost)}
              </AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
                alignItems: "center",
              }}
            >
              <AppText
                fontFamily="airMedium"
                style={{ fontSize: 20, fontFamily: "airBold" }}
              >
                Order Total
              </AppText>

              <AppText
                style={{
                  color: "#C60C30",
                  fontSize: 18,
                  fontFamily: "airBold",
                }}
              >
                {formatPrice(Number(total + avgShippingCost))}
              </AppText>
            </View>
          </View>

          <View style={tw`bg-white rounded-md p-4 border border-gray-300 mt-4`}>
            <AppText
              style={{ fontSize: 16, fontFamily: "airMedium", color: "gray" }}
            >
              Pay With
            </AppText>

            <AppText
              style={{ fontSize: 16, fontFamily: "airMedium", marginTop: 7 }}
            >
              Pay on Delivery (Cash)
            </AppText>
          </View>

          <Space space={10} />

          {/* <Pressable
            onPress={() => checkout()}
            style={{
              backgroundColor: "#FFC72C",
              height: 50,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <AppText fontSize="medium" fontFamily="airMedium">
              Place your order
            </AppText>
          </Pressable> */}
          <Button onPress={() => checkout()} label={isCheckoutInProgress ? "Processing" : "Place your order"} />

          <Pressable
            onPress={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              }
            }}
            style={{
              // backgroundColor: AppColors.Grey,
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            <AppText fontFamily="airMedium" style={tw`text-base text-teal-600`}>
              Go back
            </AppText>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}
