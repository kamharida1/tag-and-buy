import { StyleSheet, TouchableOpacity, View } from 'react-native'
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

  const selectCategory = (index: number) => { 
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: x -16, y: 0, animated: true });
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
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={styles.filterBtn}
          >
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            //backgroundColor: 'red',
            //gap: 20,
            //paddingHorizontal: 16,
          }}
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
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 8,
                  paddingBottom: 0,
                  //gap: 2,
                }}
              >
                {category.icon}
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      fontFamily:
                        activeIndex === index ? "airBold" : "airLight",
                      fontSize: activeIndex === index ? 14 : 13,
                      color: activeIndex === index ? "black" : "#222",
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
    height: 150,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 11,
  },
  filterBtn: {
   //]padding: 10,
    borderWidth: 1,
    borderColor: "#A2A0A2",
    borderRadius: 24,
  },
  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    width: 340,
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
    flex: 0.5,
    //paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    width: 100,
    //paddingBottom: 8,
  },
});

export default ExploreHeader;