import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

interface LoaderT {
  size?: number | "small" | "large";
  isLoading?: boolean;
}

const Loader = memo<LoaderT>(({ size, isLoading }) => {
  return (
   <View style={{
      position:'absolute',
       top: 0,
       left:0,
       bottom:0,
       right:0,
       backgroundColor: '#fff',
       alignItems: 'center',
       justifyContent: 'center'
      }}
   >

    { isLoading && <ActivityIndicator size="large" color="#000"/>}
  </View>
  );
});

export { Loader };
