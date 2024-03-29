import { useProduct } from "@/api/products";
import ImageList from "@/components/ImageList";
import formatPrice from "@/utils/naira_price";
import { Ionicons } from "@expo/vector-icons";
import PlusIcon from "../../../../assets/svgs/PlusIcon.svg";
import {router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BlurView } from 'expo-blur';
import { Modal, TouchableOpacity, Vibration } from "react-native";
import { Dimensions, Share, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, useSharedValue } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { FlexContainer, PaddingContainer } from "@/containers";
import AppText from "@/components/AppText";
import { AppColors } from "@/utils";
import Spacer from "@/components/Spacer";
import Divider from "@/components/Divider";
import { CardProductDetail } from "@/components/CardProductDetail";
import QuickActionButton from "@/components/QuickActionButton";
import AppButton from "@/components/AppButton";
import CartButtonWithIndicator from "@/components/CartButtonWithIndicator";
import ModalBottomSheet from "@/components/BottomSheet";
import ModalBottomSheetMessage from "@/components/ModalBottomSheetMessage";
import { useCartStore } from "@/store";
import { Product } from "@/types";
import { fa } from "@faker-js/faker";
import { useIsFocused } from "@react-navigation/native";
import { showProductAddedToast, showProductRemovedToast, showToast } from "@/utils/functions";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 450;

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
    const { data: productData, error, isLoading } = useProduct(id as string);

  const [isModalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState<Product>({} as Product)

  const [cartMessage, setCartMessage] = useState("");

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const AnimatedBlur = Animated.createAnimatedComponent(BlurView)
  
  const scrollOffset = useScrollViewOffset(scrollRef);

  const store = useCartStore();

  const getProductDetails = (productId: string) => {
    if (productId) {
      if (
        Object.keys(productData).length &&
        Object.hasOwn(productData, 'id')
      ) {
        const updatedProductDetails: Product = {
          ...productData,
          isFavorite: store.favorites.some(
            favorite => favorite.id === product.id
          ),
        };
        setProduct(updatedProductDetails);
      }

    }
  }

  const isProductLoaded =
    product &&
    !!product?.id &&
    !!product.title &&
    !!product.price;

  const isFocused = useIsFocused();

  const isProductInCart = store.cart.length
    ? store.cart.some((item) => item.product.id === product.id)
    : false;

  const isProductInFavorites = useMemo(() => {
    if (product) {
      return store.favorites.some(
        (product) => product.id === product.id
      );
    }
  }, [store.favorites.length, product?.isFavorite]);

  //console.warn("Product", product.title, isProductInCart);

  useEffect(() => {
    if (productData) {
      getProductDetails(productData.id);
    }
  }, [isFocused, isProductInFavorites, productData]);

   const handleAddToCart = () => {
     if (product) {
       if (isProductInCart) {
         store.removeFromCart(product?.id); // Add null check for productData
         showProductRemovedToast(product?.title || ''); // Add null check for productData
       } else {
         showProductAddedToast(product?.title || ''); // Add null check for productData
         store.addToCart(product, 1);
         toggleModalVisible();
       }
     }
   };
  
  const handleOnFavorite = () => {
    if (product) {
      if (isProductInFavorites) {
        store.removeFromFavorites(product.id);
      } else {
        store.addToFavorites(product);
        Vibration.vibrate(5);
        showToast(
          "Added to favorites",
          `${product.title} has been added to your favorites!`
        );
      }
    }
  };
  
  const handleOnBuyNow = () => {
    if (product) {
      store.addToCart(product, 1);
      router.push("/cart");
    }
  };

  const shareListing = async () => {
    try {
      await Share.share({
        title: product.title || "", // Provide a default value if product.title is null
        url: product.image || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerRight: () => (
          <Animated.View style={styles.bar}>
            <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
              <Ionicons name="share-social" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundButton} onPress={handleOnFavorite}>
             { isProductInFavorites ? <Ionicons name="heart" size={24} color="red" /> : <Ionicons name="heart" size={30} color="black" /> }
            </TouchableOpacity>
          </Animated.View>
        ),
        headerTitle: "",
        headerTransparent: true,
        headerBackground: () => (
          <Animated.View style={[headerAnimatedStyle, styles.header]}>
            <AnimatedBlur intensity={100} style={StyleSheet.absoluteFill} />
          </Animated.View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={"#000"} />
          </TouchableOpacity>
        ),
      });
  },[]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [150, IMG_HEIGHT / 1.5 ], [0, 1]),
    };
  }, []);

  const array = new Array(40).fill("");

  let closeModal = () => setModalVisible(false);

  let toggleModalVisible = () => setModalVisible(!isModalVisible);

  return (
    <Animated.View style={styles.container}>
      <StatusBar style="dark" />
      <Animated.ScrollView
        
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {!isLoading && product && (
          <>
            <ImageList scrollOffset={scrollOffset} product={product} />

            <PaddingContainer>
              <AppText fontFamily="airBold" fontSize="extraLarge">
                {product.title}
              </AppText>
              <Spacer space={20} />
              {/* <AppText fontFamily="airLight" fontSize="infinite">
                {product?.price && formatPrice(product?.price)}
              </AppText> */}
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
                    }}
                    fontSize="large"
                    //color="PureWhite"
                  >
                    {product?.old_price &&
                      formatPrice(product?.old_price) + "% OFF"}
                  </AppText>
                </View>
              </FlexContainer>
              <Divider />
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
              <Divider />
              <AppText
                fontFamily="airBold"
                fontSize="medium"
                style={{ marginBottom: 7 }}
              >
                Product Details
              </AppText>
              <CardProductDetail productDetails={product?.product_details} />
              <Divider />
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
                    <PlusIcon
                      height={25}
                      width={25}
                      fill={AppColors.PureBlack}
                    />
                  </QuickActionButton>
                </FlexContainer>
              </FlexContainer>
              <Divider />
              <Spacer space={26} />
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
                <AppButton
                  style={{ flex: 1, width: "100%" }}
                  onPress={handleOnBuyNow}
                >
                  Buy Now
                </AppButton>
              </FlexContainer>
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
            </PaddingContainer>
          </>
        )}
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addToCartButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: AppColors.PrimaryGreen,
    backgroundColor: AppColors.PureWhite,
    flex: 1,
  },
  image: { width, height: IMG_HEIGHT },
  infoContainer: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    //overflow: "hidden",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    margin: 5,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#000",
  },
  discountTextHolder: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor: AppColors.GreySurfaceSelected,
  },
});

{
  /* <View>
            {array.map((_, index) => (
              <Text key={index} style={styles.description}>
                {product?.description}
              </Text>
            ))}
          </View> */
}