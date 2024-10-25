import { createStackNavigator } from "@react-navigation/stack";

import AppSettings from "../screens/utils/AppSettings";
import ScanCard from "../screens/utils/ScanCard";
import Notification from "../screens/utils/Notifications";

import CampusServicesScreen from "../screens/main/CampusServicesScreen";


import PostItemScreen from "../screens/campus services/PostItemScreen";

const Stack = createStackNavigator();

export default function UtilsNavigator() {
    return (
        <Stack.Navigator initialRouteName="CampusServices" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CampusServices" component={CampusServicesScreen} />
            <Stack.Screen name="AppSettings" component={AppSettings} />
            <Stack.Screen name="ScanCard" component={ScanCard} />
            <Stack.Screen name="Notifications" component={Notification} />
        </Stack.Navigator>
    );
}
