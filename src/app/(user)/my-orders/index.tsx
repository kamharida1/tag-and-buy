import { View, Text } from 'react-native'
import React from 'react'
import { FlexContainer, MainContainer, PaddingContainer } from '@/containers'
import { useMyOrderList } from '@/api/orders';
import { Loader } from '@/components/Loader';
import { FlatList } from 'react-native-gesture-handler';
import OrderListItem from '@/components/OrderListItem';
import AppContainer from '@/containers/AppContainer';
import { MotiView } from 'moti';
import AppText from '@/components/AppText';
import tw from 'twrnc';
import Animated from 'react-native-reanimated';
import QuickActionButton from '@/components/QuickActionButton';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Spacer from '@/components/Spacer';
import Divider from '@/components/Divider';

export default function OrderScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

   if (isLoading) {
     return <Loader isLoading={isLoading} />;
   }
   if (error) {
     return <Text>Failed to fetch</Text>;
   }

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
              Orders
            </AppText>
          </FlexContainer>
        </PaddingContainer>
      </Animated.View>

      <View style={tw`flex-1` }>
        {!orders?.length ? (
          <View style={tw`flex-1 items-center bg-slate-100 justify-center`}>
            <AppText fontSize="infiniteLarge" fontFamily="airBold">
              No orders
            </AppText>
          </View>
        ) : (
          <>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <OrderListItem order={item} />}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListHeaderComponent={() => (
                  <View>
                    <AppText
                      fontFamily="airMedium"
                      style={{
                        fontSize: 16,
                        color: "#222",
                        margin: 10,
                        marginTop: 20,
                        marginBottom: 20,
                        paddingHorizontal: 10,
                      }}>
                      You can view your orders here
                    </AppText>
                </View>
              )}
            />
          </>
        )}
      </View>
    </MainContainer>
  );
}