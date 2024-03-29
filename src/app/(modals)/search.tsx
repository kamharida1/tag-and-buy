import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { MainContainer } from '@/containers'
import AppText from '@/components/AppText'
import { useStore } from 'zustand'
import { useCartStore } from '@/store'

const Search = () => {
  const isPresented = router.canGoBack();
  const store = useCartStore();

  return (
    <MainContainer fillHeight>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <AppText>Helllo Universe</AppText>
      {store.favorites.map((favorite, idx)=><AppText key={idx}>{favorite?.id}</AppText>)}
    </MainContainer>
  );
}

export default Search

const styles = StyleSheet.create({})