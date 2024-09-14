import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Homescreen from "../screens/main/Homescreen";
import CampusServicesScreen from "../screens/main/CampusServicesScreen";
import AccessHistoryScreen from "../screens/main/AccessHistoryScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

import { Colors } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Homescreen} />
            <Tab.Screen
                name="Campus Services"
                component={CampusServicesScreen}
            />
            <Tab.Screen
                name="Access History"
                component={AccessHistoryScreen}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
