import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CartProductItem from '@/components/CartProductItem';
import { FlexContainer, MainContainer, PaddingContainer } from '@/containers';
import { Stack, router } from 'expo-router';
import AppText from '@/components/AppText';
import Spacer from '@/components/Spacer';
import { useCartStore } from '@/store';
import QuickActionButton from '@/components/QuickActionButton';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ACTIVE_BUTTON_OPACITY } from '@/constants';
import { AppColors } from '@/utils';
import AppButton from '@/components/AppButton'; 
const RenderOrderDetailsText = ({
  title,
  value,
}: {
  title: string;
  value: number;
}): JSX.Element => {
  return (
    <>
      <FlexContainer direction="row" position="rowBetween">
        <AppText fontFamily='airMedium' fontSize="medium"   color="LightGrey">
          {title}
        </AppText>
        <AppText fontSize="medium" fontFamily="airMedium" color="GreyDark">
          {`$${value || 0}`}
        </AppText>
      </FlexContainer>
      <Spacer space={13} />
    </>
  );
};

const CartScreen = () => {
  const store = useCartStore();

  const isCartEmpty = store.cart.length === 0;
  const DELIVERY_COST = 20.45;

  const getTotalCartPrice = (): number => {
    const totalCartPrice = store.cart.reduce((total, item) => {
      const price = item.product.price || 0; // Add null check for item.product.price
      return total + item.quantity * price;
    }, 0);

    return totalCartPrice;
  };

  return (
    <MainContainer style={{ paddingHorizontal: 0 }} fillHeight>
      <Stack.Screen options={{ headerShown: false }} />
      <PaddingContainer style={{padding: 0}}>
        <FlexContainer direction="row" position="start">
          <QuickActionButton
            onPress={() => router.canGoBack() && router.back()}
          >
            <AntDesign name="arrowdown" size={24} color="black" />
          </QuickActionButton>
          <Spacer space={10} between />
          <AppText fontFamily='airMedium' fontSize="medium">{`Shopping Cart (${
            store.cart.length || 0
          })`}</AppText>
        </FlexContainer>
      </PaddingContainer>
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
            {store.cart.map(({ product }, index) => {
              const isLastProduct = index === store.cart.length - 1;
              return (
                <CartProductItem
                  key={product.id}
                  product={product}
                  isLastProduct={isLastProduct}
                />
              );
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
          <RenderOrderDetailsText
            title="Subtotal"
            value={getTotalCartPrice()}
          />
          <RenderOrderDetailsText title="Delivery" value={DELIVERY_COST} />
          <RenderOrderDetailsText
            title="Total"
            value={getTotalCartPrice() + DELIVERY_COST}
          />
          <Spacer space={30} />
          <AppButton onPress={() => alert("Handle checkout!")}>
            Proceed To checkout
          </AppButton>
        </PaddingContainer>
      ) : null}
    </MainContainer>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  checkoutView: {
    backgroundColor: AppColors.GreySurface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  noItemsIndicator: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});