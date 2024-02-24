import React from "react";
import { Modal, StyleSheet } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import RoundIconButton from "../RoundIconButton";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase";


type Props = {
  activeIndex: number;
  product?: Product;
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
};

export default function ImageModal(props: Props) {
  let { activeIndex, product, isVisible, setVisible } = props;
  
  let imagesUrls = product?.images?.map((url) =>  {
    const { data } = supabase.storage.from("product-images").getPublicUrl(url);
    return { url: data.publicUrl };
  });
  console.log(imagesUrls);

  let renderHeader = () => (
    <RoundIconButton
      name={"close"}
      color={"background"}
      size={35}
      onPress={() => setVisible(false)}
      style={styles.headerIcon}
    />
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onDismiss={() => setVisible(false)}
      animationType={"slide"}
    >
      <ImageViewer
        index={activeIndex}
        imageUrls={imagesUrls}
        enableSwipeDown
        onSwipeDown={() => setVisible(false)}
        renderHeader={renderHeader}
        useNativeDriver={true}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    position: "absolute",
    left: 0,
    top: 17,
    zIndex: 14,
  },
});
