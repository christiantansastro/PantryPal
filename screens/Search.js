import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SearchBar, ListItem } from "@rneui/themed";
import Octicons from "@expo/vector-icons/Octicons";

import color from "../config/color";
import size from "../config/size";

function Recipe({ ingredients }) {
  const [recipeName, setRecipeName] = useState([]);
  const [recipeImg, setRecipeImg] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [data, setData] = useState([]);

  const route = useRoute();
  const preds = route.params?.preds;

  if (!preds == 0) {
    if (preds.length > 1) {
      preds.filter((item, index) => preds.indexOf(item) === index);
      preds = preds.join("%2C%20");
    }
  }

  useEffect(() => {
    function getRecipeInfo(ingredients) {
      fetch(
        "https://api.edamam.com/api/recipes/v2?type=public&q=" +
          ingredients +
          "&app_id=ccaf5678&app_key=7feba978f4fdf6433111398f0c8d05b4",
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data.hits);
        });
    }

    getRecipeInfo(preds ? preds : "chicken%2C%20pasta%2C%20cheese%2C%20cream");
  }, []);

  return (
    <ScrollView
      style={{ width: wp(100), height: hp(100) }}
      contentContainerStyle={{ alignItems: "center", paddingBottom: hp(10) }}
    >
      {data.map((data, index) => (
        <TouchableOpacity
          key={index}
          style={{
            width: wp(90),
            height: hp(15),
            flexDirection: "row",
            flexWrap: "wrap",
            borderRadius: wp(5),
            marginVertical: hp(1.5),
            elevation: 5,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: "35%",
              height: "100%",
              justifyContent: "center",
              padding: wp(2),
            }}
          >
            <Image
              borderRadius={wp(5)}
              style={{ width: "100%", height: "100%" }}
              source={{ uri: data.recipe.image }}
            />
          </View>
          <View style={{ width: "50%", height: "100%" }}>
            <Text style={styles.headerText2}>{data.recipe.label}</Text>
            <Text
              style={{
                fontFamily: "circular",
                textTransform: "capitalize",
                left: wp(2),
              }}
            >
              {data.recipe.cuisineType}
            </Text>
          </View>
          <View
            style={{ width: "15%", height: "100%", justifyContent: "center" }}
          >
            <Octicons
              name="arrow-right"
              color={"white"}
              size={16}
              style={{
                backgroundColor: color.primary,
                alignSelf: "center",
                paddingHorizontal: wp(3),
                paddingVertical: wp(2),
                borderRadius: wp(3),
              }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const Search = () => {
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
          <Text style={styles.headerText}>Search</Text>
          <SearchBar
            placeholder="Search recipe"
            inputStyle={{
              fontFamily: "circular",
              fontSize: size.body_2,
              opacity: 0.6,
            }}
            containerStyle={{
              width: wp(95),
              height: "60%",
              borderTopColor: "transparent",
              backgroundColor: "white",
              top: hp(3),
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
        <View style={styles.main}>
          <Recipe ingredients={"banana%2C%20chocolate"} />
        </View>
        <View style={styles.footer}></View>
      </View>
    </SafeAreaView>
  );
};

export default Search;

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
    fontSize: hp(4),
    fontFamily: "circular",
    position: "relative",
  },
  headerText2: {
    fontSize: hp(2.5),
    paddingTop: wp(4),
    paddingLeft: wp(2),
    fontFamily: "circular",
  },
});
