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
                    height: 60,
                    borderTopWidth: 0.5,
                    paddingBottom: 10,
                    borderTopColor: currentColors.text,
                },
                tabBarActiveTintColor: currentColors.text,
                headerShown: false,
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomescreenAlt} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Octicons name="home" size={size} color={color} />
                    ),
                }}/>
            <Tab.Screen
                name="Campus Services"
                component={CampusServicesScreen}

            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
