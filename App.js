import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Octicons from "@expo/vector-icons/Octicons";

import Splash from "../PantryPal/screens/Splash";
import Home from "../PantryPal/screens/Home";
import Search from "../PantryPal/screens/Search";
import Camera from "../PantryPal/screens/Camera";

import color from "../PantryPal/config/color";
import size from "../PantryPal/config/size";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <View style={{ height: hp(100), backgroundColor: "white" }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            marginHorizontal: wp(18),
            bottom: hp(3),
            borderRadius: 25,
            height: hp(8),
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Octicons
                name="home"
                color={focused ? color.primary : "grey"}
                size={28}
              />
            ),
          }}
          name="Home"
          component={Home}
        />
        <Tab.Screen
          options={{
            tabBarIcon: () => (
              <Octicons
                name="plus"
                color={"white"}
                size={24}
                backgroundColor={color.primary}
                style={{
                  paddingVertical: hp(2),
                  paddingHorizontal: hp(2.5),
                  borderRadius: wp(10),
                  bottom: hp(2.5),
                  shadowColor: "black",
                  elevation: hp(1.5),
                }}
              />
            ),
          }}
          name="Camera"
          component={Camera}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Octicons
                name="search"
                color={focused ? color.primary : "grey"}
                size={28}
              />
            ),
          }}
          name="Search"
          component={Search}
        />
      </Tab.Navigator>
    </View>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
