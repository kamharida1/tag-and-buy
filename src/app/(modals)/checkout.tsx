import Header from "@/components/Header";
import { Text } from "@/components/Theme";
import { MainContainer } from "@/containers";
import AppContainer from "@/containers/AppContainer";
import { router } from "expo-router";
import tw from "twrnc";

export default function Checkout() {
  return (
    // <MainContainer style={{paddingVertical: 0}} fillHeight>
    //   <Header
    //     headerText="Checkout"
    //     leftNode={
    //       <Text variant={"button"} style={tw`text-xl text-[17px] text-sky-800`}>
    //         Back
    //       </Text>
    //     }
    //     handleOnPressLeftNode={() => router.back()}
    //   />
    // </MainContainer>
    <AppContainer
      scroll
      safe
      header
      headerText="Hello World"
      leftNode={<Text>Back</Text>}
      handleOnPressLeftNode={() => router.back()}
    >
      <Text>Checkout</Text>
    </AppContainer>
  );
}