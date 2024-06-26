import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CartProductItem from '@/components/CartProductItem';
import { FlexContainer, MainContainer, PaddingContainer } from '@/containers';
import { Stack, router } from 'expo-router';
import AppText from '@/components/AppText';
import Spacer from '@/components/Spacer';
import QuickActionButton from '@/components/QuickActionButton';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ACTIVE_BUTTON_OPACITY } from '@/constants';
import AppButton from '@/components/AppButton'; 
import Animated from 'react-native-reanimated';
import formatPrice from '@/utils/naira_price';
import { useCart } from '@/providers/CartProvider';

const RenderOrderDetailsText = ({
  title,
  value,
}: {
  title: string;
  value: any;
}): JSX.Element => {
  return (
    <>
      <FlexContainer direction="row" position="rowBetween">
        <AppText fontFamily='airMedium' fontSize="medium" color="LightGrey">
          {title}
        </AppText>
        <AppText fontSize="medium" fontFamily="airMedium" color="GreyDark">
          {formatPrice(value)}
        </AppText>
      </FlexContainer>
      <Spacer space={13} />
    </>
  );
};

const CartScreen = () => {

  const { items, total, avgShippingCost } = useCart();


  const isCartEmpty = items.length === 0;
  const DELIVERY_COST = 20.45;

  // const getTotalCartPrice = (): number => {
  //   const totalCartPrice = items.reduce((total, item) => {
  //     const price = item.product.price || 0; // Add null check for item.product.price
  //     return total + item.quantity * price;
  //   }, 0);

  //   return totalCartPrice;
  // };

  return (
    <MainContainer style={{ paddingHorizontal: 0 }} fillHeight>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View style={{ height: 50, width: "100%" }}>
        <PaddingContainer style={{ padding: 0 }}>
          <FlexContainer direction="row" position="start">
            <QuickActionButton
              onPress={() => router.canGoBack() && router.back()}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </QuickActionButton>
            <Spacer space={10} between />
            <AppText
              fontFamily="airMedium"
              fontSize="extraLarge"
            >{`Shopping Cart (${items.length || 0})`}</AppText>
          </FlexContainer>
        </PaddingContainer>
      </Animated.View>
      {isCartEmpty ? (
        <View style={styles.noItemsIndicator}>
          <AppText fontSize="extraLarge">
            Uh oh, Looks like you haven't shopped anything!
          </AppText>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <PaddingContainer style={{ paddingVertical: 0 }}>
            <Spacer space={30} />
            {items.map((item, index) => {
              const isLastProduct = index === items.length - 1;
              return <CartProductItem key={item.id} cartItem={item} />;
            })}
            <Spacer space={10} />
            {!isCartEmpty ? (
              <FlexContainer position="end">
                <TouchableOpacity
                  activeOpacity={ACTIVE_BUTTON_OPACITY}
                  onPress={() => alert("Handle edit!")}
                >
                  <AppText color="PrimaryBlue">Edit</AppText>
                </TouchableOpacity>
              </FlexContainer>
            ) : null}
            <Spacer space={30} />
          </PaddingContainer>
        </ScrollView>
      )}

      {!isCartEmpty ? (
        <PaddingContainer style={styles.checkoutView}>
          <Spacer space={10} />
          <RenderOrderDetailsText title="Subtotal" value={total} />
          <RenderOrderDetailsText title="Delivery" value={avgShippingCost} />
          <RenderOrderDetailsText title="Total" value={total + avgShippingCost} />
          <Spacer space={30} />
          <AppButton onPress={() => router.push(`/(modals)/checkout`)}>
            Proceed To checkout
          </AppButton>
        </PaddingContainer>
      ) : null}
    </MainContainer>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  checkoutView: {},
  noItemsIndicator: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});