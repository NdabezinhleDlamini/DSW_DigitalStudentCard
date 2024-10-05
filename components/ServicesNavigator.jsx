import { createStackNavigator } from "@react-navigation/stack";

import AccessHistoryScreen from "../screens/campus services/AccessHistoryScreen";
import CardCollection from "../screens/campus services/CardCollection";
import LostAndFound from "../screens/campus services/LostAndFound";
import RequestNewCard from "../screens/campus services/RequestNewCard";

const Stack = createStackNavigator();

export default function ServicesNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AccessHistory" component={AccessHistoryScreen} />
            <Stack.Screen name="LostAndFound" component={LostAndFound} />
            <Stack.Screen name="RequestNewCard" component={RequestNewCard} />
            <Stack.Screen name="CardCollection" component={CardCollection} />
        </Stack.Navigator>
    );
}
