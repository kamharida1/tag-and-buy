import { useProductList } from "@/api/products";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import { Stack } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() { 
  const { data: products, error, isLoading } = useProductList();
  const [category, setCategory] = useState<string>("Freezers");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => product.category === category);
  }, [products, category]);
  
  const onCategoryChanged = useCallback((category: string) => { 
    setCategory(category);
  }, []);


  return (
    <View style={{ flex: 1, marginTop: 150 }}>
      <Stack.Screen
        options={{
          header: () => (
            <ExploreHeader onCategoryChanged={onCategoryChanged} />
          ),
        }}
      />
      <ListingsBottomSheet listings={filteredProducts} category={category} />
    </View>
  )
}