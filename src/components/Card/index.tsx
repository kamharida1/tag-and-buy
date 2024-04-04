import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Card = () => {
  return (
    <View style={styles.card}>
      <Text>Card</Text>
    </View>
  )
}

export default Card;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
    shadowRadius: 7,
    elevation: 1,
    borderRadius: 10,
    //marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});