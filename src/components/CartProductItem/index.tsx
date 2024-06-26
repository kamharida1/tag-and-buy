import { FlexContainer, PaddingContainer } from "@/containers";
import { CartItem, Product } from "@/types";
import { memo } from "react";
import tw from "twrnc"
import AppText from "../AppText";
import { Image, Pressable, View } from "react-native";
import Divider from "../Divider";
import { AntDesign } from "@expo/vector-icons";
import formatPrice from "@/utils/naira_price";
import { useCartStore } from "@/store";
import { showToast } from "@/utils/functions";
import { RemoteImage } from "../RemoteImage";
import { defaultPizzaImage } from "../ProductListItem";
import { useCart } from "@/providers/CartProvider";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartProductItem = memo<CartListItemProps>(
  ({ cartItem }) => {
    const { updateQuantity, deleteItem,} = useCart();

    return (
      <PaddingContainer style={tw`bg-white`}>
        <FlexContainer position="start">
          <FlexContainer position="rowBetween">
            <RemoteImage
              path={cartItem?.product?.image}
              fallback={defaultPizzaImage}
              style={tw`w-25 h-25 rounded-2xl mr-5 overflow-hidden`}
              resizeMode="cover"
            />
            <FlexContainer>
              <AppText
                fontFamily="airMedium"
                color="PureBlack"
                numberOfLines={3}
                ellipsizeMode="tail"
                style={tw.style(`w-63 text-base`)}
              >
                {cartItem.product?.title}
              </AppText>
              <AppText style={tw`text-2xl text-zinc-900 mt-[6]`}>
                {formatPrice(cartItem.product.price || 0)}
              </AppText>
              <AppText
                fontFamily="airMedium"
                style={tw`text-sm text-zinc-900 mt-[1]`}
              >
                Qty: {cartItem.quantity}
              </AppText>
              <Image
                source={{
                  uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                }}
                style={tw`w-8 h-8`}
              />
              <AppText style={tw`text-gray-600 w-63 text-[11px]`}>
                Eligible for free shipping from 4pm - 6pm
              </AppText>
              <AppText style={tw`text-green-700 text-[16px] py-1`}>
                In Stock
              </AppText>
            </FlexContainer>
          </FlexContainer>
          <View style={tw`flex-row my-[5] gap-5 items-center`}>
            <View style={tw`my-[5] flex-row items-center `}>
              {cartItem.quantity > 1 ? (
                <Pressable
                  onPress={() => updateQuantity(cartItem.id, -1)}
                  style={tw`p-[9] bg-neutral-300 rounded-md rounded-r-sm`}
                >
                  <AntDesign name="minus" size={22} color="black" />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => deleteItem(cartItem.product)}
                  style={tw`p-[8] bg-neutral-300 rounded-md rounded-r-sm`}
                >
                  <AntDesign name="delete" size={22} color="black" />
                </Pressable>
              )}
              <Pressable style={tw`px-4 py-2 `}>
                <AppText style={tw`text-[15px]`}>{cartItem.quantity}</AppText>
              </Pressable>
              <Pressable
                onPress={() => updateQuantity(cartItem.id, 1)}
                style={tw`p-[9] bg-neutral-300 rounded-md rounded-l-sm`}
              >
                <AntDesign name="plus" size={22} color="black" />
              </Pressable>
            </View>
            <Pressable
              onPress={() => deleteItem(cartItem.product)}
              style={tw`p-[9] border border-zinc-300  bg-neutral-50 rounded-md`}
            >
              <AppText fontFamily="airMedium">Delete</AppText>
            </Pressable>
          </View>
          <View style={tw`flex-row mt-3 mb-5 gap-5 items-center`}>
            <Pressable
              style={tw`p-[9] border border-zinc-300  bg-neutral-50 rounded-md`}
            >
              <AppText fontFamily="airMedium">Save For Later</AppText>
            </Pressable>
            <Pressable
              style={tw`p-[9] border ml-[7] border-zinc-300  bg-neutral-50 rounded-md`}
            >
              <AppText fontFamily="airMedium">See More Like this</AppText>
            </Pressable>
          </View>
        </FlexContainer>
        <Divider />
      </PaddingContainer>
    );
  }
);

export default CartProductItem;