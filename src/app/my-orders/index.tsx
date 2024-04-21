import { View, Text } from 'react-native'
import React from 'react'
import { MainContainer } from '@/containers'
import { useMyOrderList } from '@/api/orders';
import { Loader } from '@/components/Loader';
import { FlatList } from 'react-native-gesture-handler';
import OrderListItem from '@/components/OrderListItem';
import AppContainer from '@/containers/AppContainer';
import { MotiView } from 'moti';
import AppText from '@/components/AppText';
import tw from 'twrnc';

export default function OrderScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

   if (isLoading) {
     return <Loader isLoading={isLoading} />;
   }
   if (error) {
     return <Text>Failed to fetch</Text>;
   }

  return (
    <View style={{ padding: 10, gap: 20, flex: 1 }}>
      {!orders?.length ? (
        <View style={tw`flex-1 items-center bg-slate-100 justify-center`}>
          <AppText fontSize="infiniteLarge" fontFamily="airBold">
            No orders
          </AppText>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OrderListItem order={item} />}
          // renderItem={({ item }) => <OrderListItem order={item} />}
        />
      )}
    </View>
  );
}