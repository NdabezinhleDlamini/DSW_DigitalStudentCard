import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomescreenAlt from "../screens/main/Homescreen-alt";
import CampusServicesScreen from "../screens/main/CampusServicesScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

import { ThemeContext } from "../contexts/ThemeContext";
import { Colors } from "../constants/Colors";
import { Ionicons, Octicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const { currentColors } = useContext(ThemeContext);

    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: currentColors.background,
            borderTopColor: currentColors.background,
            position: "absolute",
            bottom: 20,
            marginHorizontal: 25,
            paddingVertical: 0,
            borderRadius: 25,
            borderCurve: "continuous",
            shadowOffset: { width: 0, height: 10 },
            shadowColor: "rgba(128, 128, 128, 0.3)",
            shadowOpacity: 0.9,
            shadowRadius: 5,
            elevation: 6,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomescreenAlt}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Octicons name="home" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Campus Services"
          component={CampusServicesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school-outline" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={26} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
}
