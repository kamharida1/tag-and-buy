import { useAddress } from "@/api/addresses";
import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";
import AppText from "@/components/AppText";
import OrderItemListItem from "@/components/OrderItemListItem";
import StepIndicator from "react-native-step-indicator";
import QuickActionButton from "@/components/QuickActionButton";
import Spacer from "@/components/Spacer";
import { FlexContainer, MainContainer, PaddingContainer } from "@/containers";
import { Tables } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import tw from "twrnc";
import { customStyles } from "@/helpers/stepIndicatorStyle";
import BasicProductList from "@/components/BasicProductList";
import formatPrice from "@/utils/naira_price";

export default function OrderDetailsScreen() {
  const { order: orderDetail } = useLocalSearchParams();
  const order = JSON.parse(orderDetail as string);
  const {
    data: orderDetails,
    isLoading,
    error,
  } = useOrderDetails(order.id as string);
  useUpdateOrderSubscription(order.id as string);
  const { data: address } = useAddress(order?.address_id as string);
  const [trackingState, setTrackingState] = useState(1);
  const labels = [
    "New",
    "Preparing",
    "Shipped",
    "Delivered",
    // "Cancelled",
    // "Refunded",
  ];
  const [statusDisable, setStatusDisable] = useState(false);
  const [value, setValue] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(0);

  //method to convert time to AM PM format
  function tConvert(date: string | number | Date): string {
    let t = new Date(date);
    const hours = ("0" + t.getHours()).slice(-2);
    const minutes = ("0" + t.getMinutes()).slice(-2);
    const seconds = ("0" + t.getSeconds()).slice(-2);
    let time: string[] = [`${hours}:${minutes}:${seconds}`];
    // Check correct time format and split into components
    const match = time[0].match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/);
    if (match) {
      time = match;
    }

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = (+time[0] % 12 || 12).toString(); // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  //method to convert date to a readable format dd-mm-yyyy, hh:mm:ss AM/PM
  const dateFormat = (datex: string | number | Date): string => {
    let t = new Date(datex);
    const date = ("0" + t.getDate()).slice(-2);
    const month = ("0" + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ("0" + t.getHours()).slice(-2);
    const minutes = ("0" + t.getMinutes()).slice(-2);
    const seconds = ("0" + t.getSeconds()).slice(-2);
    const time = tConvert(`${hours}:${minutes}:${seconds}`);
    const newDate = `${date}-${month}-${year}, ${time}`;

    return newDate;
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !orderDetails) {
    return <Text>Failed to fetch order</Text>;
  }

  useEffect(() => {
    if (orderDetails?.status === "DELIVERED" || orderDetails?.status === "CANCELLED" || orderDetails?.status === "REFUNDED") {
      setStatusDisable(true);
    } else {
      setStatusDisable(false);
    }
    setValue(orderDetails?.status);
    if (orderDetails) {
      let packageItems = 0;
      let totalCost = 0;
      orderDetails?.order_items.forEach((item: any) => {
        totalCost += item.products.price;
        packageItems += item.quantity;
      });
      setTotalCost(totalCost);
      setQuantity(packageItems);
    }
    if(orderDetails?.status === "PROCESSING" ){
      setTrackingState(1);
    } else if(orderDetails?.status === "SHIPPED"){
      setTrackingState(2);
    }else if(orderDetails?.status === "DELIVERED"){
      setTrackingState(3);  
    } else if(orderDetails?.status === "CANCELLED"){
      setTrackingState(4);
    } else if(orderDetails?.status === "REFUNDED"){
      setTrackingState(5);
    }
   }, [orderDetails]);

  return (
    <MainContainer
      style={{ paddingHorizontal: 0, backgroundColor: "transparent" }}
      fillHeight
    >
      <Animated.View style={{ height: 47, width: "100%", paddingBottom: 10 }}>
        <PaddingContainer style={{ padding: 0 }}>
          <FlexContainer direction="row" position="start">
            <QuickActionButton
              onPress={() => router.canGoBack() && router.back()}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </QuickActionButton>
            <Spacer space={30} between />
            <AppText fontFamily="airMedium" fontSize="extraLarge">
              Order Details
            </AppText>
          </FlexContainer>
        </PaddingContainer>
      </Animated.View>

      <FlatList
        data={orderDetails?.order_items}
        renderItem={({ item, index }) => {
          const isLastProduct = index === orderDetails?.order_items.length - 1;
          return (
            <View
              style={{
                paddingHorizontal: 8,
              }}
            >
              <BasicProductList
                isLastProduct={isLastProduct}
                address={address}
                item={item}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`p-1 m-1`}
        ListFooterComponent={() => (
          <View style={tw`bg-white mt-2 mx-2 rounded-lg shadow-md`}>
            <View
              style={tw`flex flex-row justify-between items-center w-full p-2`}
            >
              <AppText
                fontFamily="airMedium"
                style={tw.style(`text-stone-500 text-[16px] m-1`)}
              >
                Total
              </AppText>
              <AppText
                fontFamily="airMedium"
                style={tw.style(`text-stone-800 text-[17px]`)}
              >
                {formatPrice(totalCost)}
              </AppText>
            </View>
            <View
              style={tw`flex flex-row justify-between items-center w-full p-2`}
            >
              <AppText
                fontFamily="airMedium"
                style={tw.style(`text-stone-500 text-[16px] m-1`)}
              >
                Quantity
              </AppText>
              <AppText
                fontFamily="airMedium"
                style={tw.style(`text-stone-800 text-[16px]`)}
              >
                {quantity}
              </AppText>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={tw`flex-1 p-1`}>
            
            <AppText
              fontFamily="airMedium"
              style={tw`text-[16px] text-zinc-800 m-2 `}
            >
              You can view all details about the order
            </AppText>
            <View style={tw.style(`flex-1 w-full p-1`)}>
              <View style={tw`mt-0 flex flex-col justify-center items-start`}>
                <View>
                  <AppText
                    fontFamily="airMedium"
                    style={tw`text-[20px] text-zinc-600  p-2`}
                  >
                    Shipping Address
                  </AppText>
                </View>
                <View
                  style={tw` bg-white w-full p-2 rounded-lg flex mt-1 flex-col justify-center items-start `}
                >
                  <AppText style={tw`text-stone-500 text-[15px]`}>
                    {address?.street} {address?.street2} {address?.city}{" "}
                  </AppText>
                  <AppText style={tw`text-gray-500 text-[15px]`}>
                    {address?.zip_code}
                  </AppText>
                </View>
              </View>
              <View>
                <AppText
                  fontFamily="airMedium"
                  style={tw`text-[20px] text-zinc-600  p-2`}
                >
                  Order Info
                </AppText>
              </View>
              <View
                style={tw`flex flex-col items-start justify-center bg-white p-2 shadow-sm rounded-lg`}
              >
                <AppText
                  fontFamily="airMedium"
                  style={tw.style(`text-stone-500 text-[19px] m-1`)}
                >
                  {" "}
                  Order # {orderDetails?.order_no}
                </AppText>
                <AppText
                  fontFamily="airMedium"
                  style={tw.style(`text-stone-500 text-[14px] m-1`)}
                >
                  {" "}
                  Ordered on {tConvert(orderDetails?.created_at)}
                </AppText>
                {orderDetails?.shipped_at && (
                  <AppText
                    fontFamily="airMedium"
                    style={tw.style(`text-stone-500 text-[14px] m-1`)}
                  >
                    Shipped on {dateFormat(orderDetails?.shipped_at)}
                  </AppText>
                )}
                {orderDetails?.delivered_at && (
                  <AppText
                    fontFamily="airMedium"
                    style={tw.style(`text-stone-500 text-[14px] m-1`)}
                  >
                    Delivered on {orderDetails?.delivered_at}
                  </AppText>
                )}
                <View style={tw`mt-2  w-full`}>
                  <StepIndicator
                    customStyles={customStyles}
                    currentPosition={trackingState}
                    labels={labels}
                    stepCount={4}
                  />
                </View>
              </View>

              <View style={tw`mt-2 flex flex-col items-start justify-center`}>
                <View>
                  <AppText
                    fontFamily="airMedium"
                    style={tw`text-[20px] text-zinc-600  p-2`}
                  >
                    Package Details
                  </AppText>
                </View>
              </View>
              <View
                style={tw`flex flex-col justify-center items-start bg-white p-2 rounded-lg mb-[-12px]`}
              >
                <View
                  style={tw`w-full flex flex-row justify-between items-center`}
                >
                  <AppText
                    fontFamily="airMedium"
                    style={tw.style(`text-stone-500 text-[16px] m-1`)}
                  >
                    Package
                  </AppText>
                  <AppText
                    fontFamily="airMedium"
                    style={tw.style(`text-stone-500 text-[16px]`)}
                  >
                    {value}
                  </AppText>
                </View>
                <View
                  style={tw`w-full flex flex-row justify-between items-center`}
                >
                  <AppText
                    fontFamily="airMedium"
                    style={tw.style(`text-stone-500 text-[14px] m-1`)}
                  >
                    Ordered on : {tConvert(orderDetails?.created_at)}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </MainContainer>
  );
}
