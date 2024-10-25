import { createStackNavigator } from "@react-navigation/stack";

import AccessHistoryScreen from "../screens/campus services/AccessHistoryScreen";
import CardCollection from "../screens/campus services/CardCollection";
import LostAndFound from "../screens/campus services/LostAndFound";
import RequestNewCard from "../screens/campus services/RequestNewCard";
import PostItemScreen from "@/screens/campus services/PostItemScreen";
import HomescreenAlt from "@/screens/main/Homescreen-alt";

import UtilsNavigator from "./UtilsNavigator";

const Stack = createStackNavigator();

export default function ServicesNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="HomeScreen" component={HomescreenAlt} />

            <Stack.Screen name="Utils" component={UtilsNavigator} />
            <Stack.Screen
                name="AccessHistory"
                component={AccessHistoryScreen}
            />
            <Stack.Screen name="LostAndFound" component={LostAndFound} />
            <Stack.Screen name="RequestNewCard" component={RequestNewCard} />
            <Stack.Screen name="CardCollection" component={CardCollection} />

            <Stack.Screen name="PostItemScreen" component={PostItemScreen} />
        </Stack.Navigator>
    );
}
