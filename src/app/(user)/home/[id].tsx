import { useProduct } from "@/api/products";
import ImageList from "@/components/ImageList";
import formatPrice from "@/utils/naira_price";
import { Ionicons } from "@expo/vector-icons";
import PlusIcon from "../../../../assets/svgs/PlusIcon.svg";
import {useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { BlurView } from 'expo-blur';
import { Modal, TouchableOpacity } from "react-native";
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

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 450;

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useProduct(id as string);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const AnimatedBlur = Animated.createAnimatedComponent(BlurView)
  
  const scrollOffset = useScrollViewOffset(scrollRef);

  const shareListing = async () => {
    try {
      await Share.share({
        title: product.title,
        url: product.image,
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
            <TouchableOpacity style={styles.roundButton} onPress={() => shareListing}>
              <Ionicons name="share-social" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
              <Ionicons name="heart" size={24} color="black" />
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

  let toggleModalVisible = () => setModalVisible(true);

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
                {product?.title}
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
                    color="PureWhite"
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
              <AppText
                fontSize="regular"
                color="PureBlack"
                fontFamily="airRegular"
              >
                {product?.description}
              </AppText>
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
                    {product?.reviews || "0"}
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
                <AppButton
                  style={styles.addToCartButton}
                  onPress={() => toggleModalVisible()}
                  color="PrimaryBlue"
                >
                  {"Add To Cart"}
                </AppButton>
                <Spacer space={20} />
                <AppButton
                  style={{ flex: 1, width: "100%" }}
                  onPress={() => alert("Buy now")}
                >
                  Buy Now
                </AppButton>
              </FlexContainer>
              <ModalBottomSheet
                title="Errors in the code"
                isModalVisible={isModalVisible}
                onClose={closeModal}
              >
                <ModalBottomSheetMessage
                  isError={isModalVisible}
                  buttonText="Try Again"
                  message="An error occured while adding to cart"
                  onPressModalButton={closeModal}
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
    borderColor: AppColors.PrimaryBlue,
    backgroundColor: undefined,
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
    backgroundColor: AppColors.PrimaryGreen,
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