import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "moti";
import { Link, useLocalSearchParams } from "expo-router";
import { useCartStore } from "@/store";
import { CardFavorites } from "@/components/CardFavorites";
import AppText from "@/components/AppText";
import tw from "twrnc";
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
          ListHeaderComponent={() => (
            <AppText
              fontFamily="airBold"
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#333",
                margin: 10,
                paddingHorizontal: 10,
              }}
            >
              Wishlist
            </AppText>
          )}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <AppText  style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
            No items on wishlist
            </AppText>
            <Link href={`/`} asChild>
              <TouchableOpacity style={tw`mt-4 border p-3 border-gray-400 rounded-md`}>
                <AppText style={{ }} fontSize="large" fontFamily="airBold">ADD PRODUCT</AppText>
              </TouchableOpacity>
            </Link>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
