import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Page = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page never been the same</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cacaca",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "500",
    color: "#00000005",
    alignSelf: "center",
  },
});
