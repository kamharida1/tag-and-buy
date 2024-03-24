import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CartProductItem from '@/components/CartProductItem';

const CartScreen = () => {
  return (
    <CartProductItem product={{title: "Hisense Refrigerator", price: 20}} quantity={5} />
  )
}

export default CartScreen;

const styles = StyleSheet.create({})