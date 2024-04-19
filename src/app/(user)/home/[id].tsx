import AppText from "@/components/AppText";
import { Image, MotiView } from "moti";
import { Share, StyleSheet, View, ActivityIndicator, Vibration } from "react-native";
import Animated, { BounceIn, BounceInDown, BounceInUp, Easing, Extrapolate, FadeInDown, FadeInUp, FadeOutUp, FlipInEasyX, FlipInEasyY, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlusIcon from "../../../../assets/svgs/PlusIcon.svg";
import Heart from "../../../../assets/svgs/Heart.svg";
import ArrowIcon from "../../../../assets/svgs/Arrow.svg";
import ShareIcon from "../../../../assets/svgs/Share.svg";
import { Loader } from "@/components/Loader"
import tw from 'twrnc'

import { faker } from "@faker-js/faker";
import { router, useLocalSearchParams } from "expo-router";
import { useProduct } from "@/api/products";
import ImageList from "@/components/ImageList";
import { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE } from "@/constants";
import { showProductAddedToast, showProductRemovedToast } from "@/utils/functions";
import { useState } from "react";
import { FlexContainer, PaddingContainer } from "@/containers";
import Spacer from "@/components/Spacer";
import formatPrice from "@/utils/naira_price";
import Divider from "@/components/Divider";
import { AppColors } from "@/utils";
import { CardProductDetail } from "@/components/CardProductDetail";
import QuickActionButton from "@/components/QuickActionButton";
import AppButton from "@/components/AppButton";
import ModalBottomSheet from "@/components/BottomSheet";
import ModalBottomSheetMessage from "@/components/ModalBottomSheetMessage";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types";
import { useCart } from "@/providers/CartProvider";


const DATA = Array(10)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    avatar: faker.image.avatar(),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  }));

export default function ProductDetails() {
  const { id: idString } = useLocalSearchParams();
  const { data: product, error, isLoading } = useProduct(idString as string);
  const [isModalVisible, setModalVisible] = useState(false);

  // console.log("Product: ", product)
  //const store = useCartStore();

  const { items, deleteItem, addItem, clearCart } = useCart();
   const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    //console.warn(event.contentOffset.y);
  });

  const buyNowButtonStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: interpolate(
        scrollY.value,
        [905, 920, 961],
        [0, 0.5, 1],
        Extrapolate.CLAMP
      ),
      zIndex: interpolate(
        scrollY.value,
        [905, 961],
        [0, 101],
        Extrapolate.CLAMP
      ),
    };
  });

  const topBarStyle = useAnimatedStyle(() => { 
    "worklet";
    return {
      opacity: interpolate(
        scrollY.value,
        [700, 898],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      height: interpolate(
        scrollY.value,
        [0, HEADER_SCROLL_DISTANCE],
        [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolate.CLAMP
      ),
    };
  });

  const renderListItem = (item: any) => (
    <Animated.View key={item.id} style={styles.card}>
      <Image style={styles.avatar} source={{ uri: item.avatar }} />
      <AppText numberOfLines={2} style={styles.fullNameText}>
        {item.fullName}
      </AppText>
    </Animated.View>
  );

  const insets = useSafeAreaInsets();

  const shareListing = async () => {
    try {
      await Share.share({
        title: product?.title || "", // Provide a default value if product.title is null
        url: product?.image || "",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const isProductInCart = items.length
    ? items.some((item) => item.product.id === product?.id)
    : false;
  
//  const isProductInFavorites = store.favorites.length && store.favorites.some(
//    (favoriteProduct) => favoriteProduct.id === product?.id
//  );

  let toggleModalVisible = () => setModalVisible(!isModalVisible);
  let closeModal = () => setModalVisible(false);

  const handleAddToCart = () => {
    if (product ) {
      if (isProductInCart) {
       deleteItem(product); // Add null check for productData
        showProductRemovedToast(product?.title || ""); // Add null check for productData
      } else {
        showProductAddedToast(product?.title || ""); // Add null check for productData
        addItem(product);
        toggleModalVisible();
      }
    }
  };

  const handleOnBuyNow = () => {
    if (product && !isProductInCart) {
      addItem(product as Product);
      router.push("/cart");
    } else {
      router.push("/cart");
    }
  };

  // const handleOnFavorite = () => {
  //   if (product) {
  //     if (isProductInFavorites) {
  //       store.removeFromFavorites(product.id);
  //     } else {
  //       store.addToFavorites(product as Product);
  //       Vibration.vibrate(5);
  //     }
  //   }
  // }

  if (isLoading) return <Loader isLoading={isLoading} />

  return (
    <Animated.View
      style={[styles.saveArea, { paddingTop: insets.top }]}
      entering={FadeInDown}
    >
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT - insets.top,
          //backgroundColor: "#fff",
        }}
      >
        <View style={{ flex: 1 }}>
          {/* {DATA.map(renderListItem)} */}
          <Animated.View style={tw` bg-white py-6 p-2 mb-1`}>
            <AppText fontFamily="airMedium" fontSize="extraLarge">
              {product?.title}
            </AppText>
            <Spacer space={15} />
            <FlexContainer position="start" direction="row">
              <AppText
                fontSize="extraLarge"
                color="PrimaryGreen"
                fontFamily="airMedium"
              >
                {product?.price && formatPrice(product?.price)}
              </AppText>
              <Spacer space={10} between />
              <View style={styles.discountTextHolder}>
                <AppText
                  style={{
                    textDecorationLine: "line-through",
                    marginBottom: 10,
                  }}
                  fontSize="large"
                  //color="PureWhite"
                >
                  {product?.old_price &&
                    formatPrice(product?.old_price) + "% OFF"}
                </AppText>
              </View>
            </FlexContainer>
          </Animated.View>
          <Animated.View style={tw`bg-white p-2 mb-1`}>
            <AppText
              fontFamily="airBold"
              fontSize="medium"
              style={{
                marginBottom: 10,
                //textDecorationLine: "underline",
              }}
            >
              Description
            </AppText>
            <AppText color="PureBlack">{product?.description}</AppText>
          </Animated.View>
          <Animated.View style={tw`bg-white p-2 mb-1`}>
            <AppText
              fontFamily="airBold"
              fontSize="medium"
              style={{ marginBottom: 7 }}
            >
              Product Details
            </AppText>
            <CardProductDetail productDetails={product?.product_details} />
          </Animated.View>

          <View style={tw`bg-white p-2`}>
            <FlexContainer position="rowBetween" direction="row">
              <FlexContainer position="start" direction="row">
                <AppText fontFamily="airBold" fontSize="medium">
                  Reviews
                </AppText>
                <Spacer space={10} between />
                <AppText color="GreyDarkLight" fontSize="large">
                  {/* {product?.reviews || "0"} */}
                </AppText>
                <Spacer between space={270} />
                <QuickActionButton onPress={() => alert("Hello")}>
                  <PlusIcon height={25} width={25} fill={AppColors.PureBlack} />
                </QuickActionButton>
              </FlexContainer>
            </FlexContainer>
          </View>
          <View style={tw`bg-white p-2 mb-1 flex`}>
            <FlexContainer position="center">
              {!isProductInCart ? (
                <>
                  <AppButton
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                    color="PrimaryGreen"
                  >
                    {"Add To Cart"}
                  </AppButton>
                </>
              ) : (
                <>
                  <AppButton
                    style={styles.addToCartButton}
                    onPress={() => {
                      router.push(`/cart`);
                    }}
                    color="PrimaryGreen"
                  >
                    {"Already in Cart. View Cart"}
                  </AppButton>
                </>
              )}
              <Spacer space={20} />
              <Animated.View style={[{ flex: 1, width: "100%" }]}>
                <AppButton onPress={handleOnBuyNow}>Buy Now</AppButton>
              </Animated.View>
            </FlexContainer>
          </View>
          <ModalBottomSheet
            title="Added to Cart "
            isModalVisible={isModalVisible}
            onClose={closeModal}
          >
            <ModalBottomSheetMessage
              isError={false}
              buttonText="Go to Cart"
              message={`${product?.title} has been added to your cart!`}
              onPressModalButton={() => {
                closeModal();
                router.push("/cart");
              }}
            />
          </ModalBottomSheet>
          <View style={tw`flex bg-white`}>
            <AppText
              fontFamily="airBold"
              fontSize="medium"
              style={tw`p-2`}>
              Similar Products
              </AppText>
            {DATA.map(renderListItem)}
          </View>
        </View>
      </Animated.ScrollView>
      <Animated.View style={[styles.header, headerStyle]}>
        {/* <Animated.Image
          style={[styles.headerBackground]}
          source={require("../../../../assets/images/brand4.jpeg")}
        /> */}
        <ImageList scrollOffset={scrollY} product={product as Product} />
      </Animated.View>
      <Animated.View style={[styles.topBar]}>
        {/* <Animated.Text style={[styles.title, topBarStyle]}>
          Management
        </Animated.Text> */}
        <Animated.View style={[styles.bar, topBarStyle]}>
          <FlexContainer position="rowBetween">
            <QuickActionButton onPress={() => router.back()}>
              <ArrowIcon height={20} width={20} fill={AppColors.PureBlack} />
            </QuickActionButton>
            <FlexContainer position="end" direction="row">
              <QuickActionButton onPress={shareListing}>
                <ShareIcon height={25} width={25} fill={AppColors.PureBlack} />
              </QuickActionButton>
              <Spacer space={20} between />
              {/* <QuickActionButton onPress={handleOnFavorite}>
                <Heart
                  height={25}
                  width={25}
                  fill={
                    isProductInFavorites
                      ? AppColors.PrimaryGreen
                      : AppColors.PureBlack
                  }
                />
              </QuickActionButton> */}
            </FlexContainer>
          </FlexContainer>
        </Animated.View>
        <Animated.View style={[buyNowButtonStyle, styles.topBarNow]}>
          <AppButton onPress={handleOnBuyNow}>Buy Now</AppButton>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: "#eff3fb",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
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
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBar: {
    marginTop: 40,
    height: 50,
    //alignItems: "center",
    //justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  bar: {
    padding: 20,
    zIndex: 99,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBarNow: {
    position: "absolute",
    right: 0,
    top: 16,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: '90%',
    height: 50,
    backgroundColor: AppColors.PrimaryGreen,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  title: {
    color: "#777",
    fontSize: 30,
    fontFamily: "airBold",
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: "contain",
    borderRadius: 54 / 2,
  },
    addToCartButton: {
      width: "100%",
      borderWidth: 1,
      borderColor: AppColors.PrimaryGreen,
      backgroundColor: AppColors.PureWhite,
      flex: 1,
    },
  discountTextHolder: {
    paddingVertical: 4,
    paddingTop: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: AppColors.GreySurfaceSelected,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
    fontFamily: "airMedium",
  },
});
