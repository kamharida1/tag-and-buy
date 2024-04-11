import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Link, router } from 'expo-router';
import AirCon from '../../../assets/svgs/AirCon.svg';
import Airplay from '../../../assets/svgs/Airplay.svg';
import Calender from '../../../assets/svgs/Calender.svg';
import Door from '../../../assets/svgs/Door.svg';
import Gas from '../../../assets/svgs/CandleStand.svg';
import Gen from '../../../assets/svgs/Gen.svg';
import Others from '../../../assets/svgs/Others.svg';
import Washer from '../../../assets/svgs/Washer.svg';
import * as Haptics from "expo-haptics";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Theme';
import { el } from '@faker-js/faker';
import { AppColors } from '@/utils';
import Divider from '../Divider';
import CartButtonWithIndicator from '../CartButtonWithIndicator';
import { useCartStore } from '@/store';

const categories = [
  {
    name: "Freezers",
    icon: <Calender width={30} height={30} />,
  },
  {
    name: "Fridges",
    icon: <Door width={30} height={30} />,
  },
  {
    name: "Gas Cookers",
    icon: <Gas width={30} height={30} />,
  },
  {
    name: "Televisions",
    icon: <Airplay
      width={30}
      height={30}
    />
  },
  {
    name: "Generators",
    icon: <Gen
      width={30}
      height={30}
      stroke={"#000"}
    />,
  },
  {
    name: "Air Conditioners",
    icon: <AirCon width={30} height={30} />,
  },
  {
    name: "Washing Machines",
    icon: <Washer width={30} height={30} />,
  },
  {
    name: "Other",
    icon: <Others width={30} height={30} />,
  },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

   const { cart } = useCartStore();
   const cartItem = cart.reduce((acc, item) => acc + item.quantity, 0);

  const selectCategory = (index: number) => { 
    const selected = itemsRef.current[index];
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = 140; // Width of each address item
    const offset = (screenWidth - itemWidth) ; // Offset to center the item
    const scrollToX = index * itemWidth - offset;
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: scrollToX, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={`/search`} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text variant={"body"}>Want something? </Text>
                  <Text variant={"body2"}>Anything . Any brand</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <CartButtonWithIndicator onPress={()=> router.push(`/cart`)} quantity={cartItem} style={{right: 12}} />
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* //contentContainerStyle={{paddingHorizontal: 16}}> */}
          {categories.map((category, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              onPress={() => selectCategory(index)}
              style={
                activeIndex === index
                  ? styles.categoriesBtnActive
                  : styles.categoriesBtn
              }
            >
              <View
                style={styles.categoryItem}
              >
                {category.icon}
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      fontFamily:
                        activeIndex === index ? "airBold" : "airLight",
                      fontSize: activeIndex === index ? 14 : 13,
                      color:
                        activeIndex === index
                          ? AppColors.PureBlack
                          : AppColors.PureBlack,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 120,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 8,
    // paddingBottom: 0,
    //gap: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 11,
  },
  filterBtn: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#A2A0A2",
    borderRadius: 100,
  },
  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    width: 350,
    gap: 10,
    borderRadius: 60,
    elevation: 2,
    shadowColor: "#000",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#c2c2c2",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  categoriesBtn: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  categoriesBtnActive: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
});

export default ExploreHeader;