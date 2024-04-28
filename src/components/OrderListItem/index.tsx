import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useSegments } from "expo-router";
import { OrderItem, Product, Tables } from "@/types";
import AppText from "../AppText";
import { useAddress } from "@/api/addresses";
import { AppColors } from "@/utils";
import { useOrderDetails } from "@/api/orders";
import tw from "twrnc";
import formatPrice from "@/utils/naira_price";
dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<"orders">;
};

function getTime(date: string | number | Date): string {
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


const dateFormat = (datex: string | number | Date): string => {
  let t = new Date(datex);
  const date = ("0" + t.getDate()).slice(-2);
  const month = ("0" + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  const hours = ("0" + t.getHours()).slice(-2);
  const minutes = ("0" + t.getMinutes()).slice(-2);
  const seconds = ("0" + t.getSeconds()).slice(-2);
   const time = getTime(`${hours}:${minutes}:${seconds}`);
  const newDate = `${date}-${month}-${year}`;

  return newDate;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const {
    data: orderDetails,
    isLoading,
    error,
  } = useOrderDetails(order.id as string);

  const { data: address, isLoading: isAddressLoading } = useAddress(order?.address_id as string);

  const products = orderDetails?.order_items.map((item: any) => {
    return item.products;
  });

  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (products) {
      let packageItems = 0;
      products.forEach(() => {
        ++packageItems;
      });
      setQuantity(packageItems);
      setTotalCost(
        products.reduce((accumulator: any, object: any) => {
          return accumulator + (object.price || 0);
        }, 0)
      );
    }
  }, [products]);

  return (
    isLoading || isAddressLoading ? null : 
    <View
      style={tw.style(`flex flex-col justify-start items-center shadow-md h-auto bg-white p-3 my-1`)}
    >
      <View style={tw`flex flex-row items-center justify-between w-full`}>
        <View>
          <AppText fontFamily="airBold" style={tw`text-[18px] text-zinc-600`}>
            Order# {order.order_no}
          </AppText>
        </View>
        <View style={tw`flex flex-col items-center justify-center `}>
          <AppText fontFamily="airBold" style={tw`text-[12px] text-teal-500`}>
            {dateFormat(order.created_at)}
          </AppText>
          <AppText fontFamily="airBold" style={tw`text-[12px] text-teal-500`}>
            {getTime(order.created_at)}
          </AppText>
        </View>
      </View>
      {address && (
        <View style={tw`flex flex-row justify-between items-center w-full`}>
          <AppText fontFamily="airMedium" style={tw`text-[15px] text-zinc-500`}>
            {address.first_name} {address.last_name}
          </AppText>
        </View>
      )}
      {address && (
        <View
          style={tw`flex mt-0.4 flex-row justify-between items-center w-full`}
        >
          <AppText fontFamily="airMedium" style={tw`text-[15px] text-zinc-500`}>
            {address.email}
          </AppText>
        </View>
      )}
      <View style={tw`flex mt-1 flex-row justify-between items-center w-full`}>
        <AppText fontFamily="airMedium" style={tw`text-[15px] text-zinc-800`}>
          Quantity: {quantity}
        </AppText>
        <AppText fontFamily="airMedium" style={tw`text-[15px] text-gray-700 `}>
          Total Cost: {formatPrice(totalCost)}
        </AppText>
      </View>
      <View style={tw`flex flex-row justify-between items-center w-full`}>
        <Link
          href={{
            pathname: "/my-orders/[order-detail]",
            params: { order: JSON.stringify(order) },
          }}
          asChild
        >
          <TouchableOpacity
            style={tw`flex bg-gray-200 mt-4 items-center justify-center w-[100px] rounded-xl border border-gray-400 p-[5px]`}
          >
            <AppText
              fontFamily="airMedium"
              style={tw`text-[15px] text-zinc-900 `}
            >
              Details
            </AppText>
          </TouchableOpacity>
        </Link>
        <AppText fontFamily="airMedium" style={tw`text-[15px] text-zinc-900 `}>
          {order.status}
        </AppText>
      </View>
    </View>

    // <Link
    //   href={{
    //     pathname: "/my-orders/[order-detail]",
    //     params: { order: JSON.stringify(order)},
    //   }}
    //   asChild
    // >
    //   <TouchableOpacity style={styles.container}>
    //     <View>
    //       <AppText style={styles.title}>Order# {order.order_no}</AppText>
    //       <AppText style={styles.time}>
    //         {dayjs(order.created_at).fromNow()}
    //       </AppText>

    //       <AppText style={styles.status}>{order.status}</AppText>
    //     </View>
    //   </TouchableOpacity>
    // </Link>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: "gray",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    marginVertical: 5,
    fontSize: 15,
  },
  time: {
    color: "gray",
    fontSize: 14,
  },
  status: {
    fontWeight: "500",
    fontSize: 14,
    color: "red",
    marginTop: 5,
  },
});

export default OrderListItem;
