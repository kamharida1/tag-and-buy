import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Link, useSegments } from "expo-router";
import { Tables } from "@/types";
import AppText from "../AppText";
import { useAddress } from "@/api/addresses";

dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Tables<"orders">;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const { data: address } = useAddress(order?.address_id as string);
  console.warn("address: ", address);
  return (
    <Link
      href={{
        pathname: "/my-orders/[id]",
        params: { id: order.id, address: JSON.stringify(address)},
      }}

      asChild
    >
      <TouchableOpacity style={styles.container}>
        <View>
          <AppText style={styles.title}>Order# {order.id}</AppText>
          <AppText style={styles.time}>
            {dayjs(order.created_at).fromNow()}
          </AppText>

          <AppText style={styles.status}>{order.status}</AppText>
          <AppText style={styles.status}>{address?.street}</AppText>
        </View>
      </TouchableOpacity>
    </Link>
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
