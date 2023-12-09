import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        margin: 0,
        backgroundColor: "white",
      }}
    >
      <LottieView
        source={require("../assets/PantryPal.json")}
        autoPlay
        loop={false}
        resizeMode="fit"
        onAnimationFinish={() => navigation.navigate("TabNavigator")}
      />
    </View>
  );
};

export default Splash;
