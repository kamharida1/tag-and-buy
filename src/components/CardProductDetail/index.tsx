import React, { memo } from "react";
import { Text,  } from "react-native";
import { View } from "../Themed";
import { FlexContainer } from "@/containers";
import Spacer from "../Spacer";
import AppText from "../AppText";

interface ProductDetailsProps {
  productDetails: any;
}

const CardProductDetail = memo(({ productDetails }: ProductDetailsProps) => {
  if (!productDetails) {
    return null; // Or handle the case when productDetails is undefined or null
  }
  //console.log("Inside Card", productDetails);
  const data = Object.entries(productDetails);
  //console.log("Data", data);
  return (
    <>
      {data.map(([key, value]) => {
        return (
          <FlexContainer
            key={key}
            direction="row"
            position="rowBetween"
            style={{
              marginVertical: 5,
            }}
          >
            <AppText
              style={{
                fontSize: 15,
                color: "#555",
              }}
            >
              {key}
            </AppText>
            <AppText
              style={{
                fontSize: 15,
                marginRight: 10,
              }}
            >
              {value as string}
            </AppText>
          </FlexContainer>
        );
      })}
    </>
  );
});

export { CardProductDetail };
