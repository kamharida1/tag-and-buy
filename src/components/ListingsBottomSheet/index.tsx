import { Tables } from "@/types";
import { useMemo, useRef, useState } from "react";
import BottomSheet from '@gorhom/bottom-sheet'
import { Text, View } from "../Themed";
import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Listings from "../Listings";


interface Props{
  listings: Tables<'products'>[];
  category: string;
}

const ListingsBottomSheet = ({ listings, category }: Props) => { 
  const snapPoints = useMemo(() => ['10%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null); 
  const [refresh, setRefresh] = useState<number>(0);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={1}
      style={styles.sheetContainer}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: "#555" }}
    >
      <View style={styles.contentContainer}>
        <Listings listings={listings} refresh={refresh} category={category} />
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  sheetContainer: {
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  }, 
});

export default ListingsBottomSheet;
