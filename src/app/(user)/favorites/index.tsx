import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "moti";
import { useLocalSearchParams } from "expo-router";
import { useCartStore } from "@/store";
import { CardFavorites } from "@/components/CardFavorites";

export default function Wishlist() {
  //  const { wishlisted } = useLocalSearchParams();
  //  const wish = JSON.parse(wishlisted as string);

  const products = useCartStore((state) => state.favorites);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {products.length ? (
        <FlatList
          data={products}
          keyExtractor={(item) => (item.id ? item.id.toString() : "default")}
          renderItem={({ item }) => <CardFavorites product={item} />}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
            No items on wishlist
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
