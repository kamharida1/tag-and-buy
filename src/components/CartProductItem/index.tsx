import { FlexContainer, PaddingContainer } from "@/containers";
import { CartItem } from "@/types";
import { memo } from "react";
import tw from "twrnc"
import AppText from "../AppText";
import { Image } from "react-native";

const CartProductItem = memo<CartItem>(({ product, quantity}) => {
  return (
    <PaddingContainer style={tw`bg-neutral-200 `}>
      <FlexContainer position="start">
        <FlexContainer direction="row">
          <FlexContainer direction="row" position="rowBetween">
            <Image
              source={require(`../../../assets/images/beauty.png`)}
              style={tw`w-30 h-30 mr-4`}
            />
            <FlexContainer position="start">
              <AppText style={tw`text-lg `}>{product.title}</AppText>
              <AppText style={tw`text-lg`}>{product.price}</AppText>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
        <PaddingContainer style={tw`bg-slate-100 `}>
          <AppText style={tw`text-sm font-light`}>Quantity: {quantity}</AppText>
        </PaddingContainer>
      </FlexContainer>
    </PaddingContainer>
  );
});

export default CartProductItem;