import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SearchBar } from "@rneui/themed";

import color from "../config/color";
import size from "../config/size";

//<Text onPress={() => navigation.navigate("Search")}>

const Home = () => {
  const navigation = useNavigation();

  const [loaded] = useFonts({
    circular: require("C:/Users/chris/react-flask/PantryPal/assets/fonts/circular.ttf"),
    Muli: require("C:/Users/chris/react-flask/PantryPal/assets/fonts/Muli.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              alignSelf: "flex-start",
              height: "40%",
              width: wp(100),
            }}
          >
            <Text style={styles.headerText}>Hi there!</Text>
            <Text style={styles.headerText2}>What are you cooking today?</Text>
          </View>
          <SearchBar
            placeholder="Search recipe"
            inputStyle={{
              fontFamily: "circular",
              fontSize: size.body_2,
              opacity: 0.6,
            }}
            containerStyle={{
              width: wp(80),
              height: "60%",
              borderTopColor: "transparent",
              backgroundColor: "white",
            }}
            inputContainerStyle={{
              backgroundColor: "white",
              borderWidth: wp(0.5),
              borderBottomWidth: hp(0.3),
              borderColor: color.primary,
            }}
            round={true}
            searchIcon={{
              type: "feather",
              color: "#86939e",
              name: "search",
              size: hp(3.5),
              paddingLeft: wp(1),
              paddingBottom: hp(0.3),
            }}
            clearIcon={{
              type: "ant-design",
              name: "close",
              size: hp(3),
            }}
          />
        </View>
        <View style={styles.main}></View>
        <View style={styles.footer}></View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "white",
  },
  container: {
    height: hp(100),
  },
  header: {
    height: hp(22),
    backgroundColor: "white",
    alignItems: "center",
    top: hp(3),
  },
  main: {
    height: hp(70),
    backgroundColor: "white",
  },
  footer: {
    height: hp(8),
    backgroundColor: "lightgreen",
  },
  headerText: {
    fontSize: hp(3),
    left: wp(5),
    fontFamily: "circular",
    position: "relative",
  },
  headerText2: {
    fontSize: hp(2),
    left: wp(5),
    fontFamily: "Muli",
    position: "relative",
  },
});
