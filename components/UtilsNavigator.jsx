import { createStackNavigator } from "@react-navigation/stack";

import AppSettings from "../screens/utils/AppSettings";
import ScanCard from "../screens/utils/ScanCard";
import EditProfile from "../screens/utils/EditProfile";
import Notification from "../screens/utils/Notifications";

const Stack = createStackNavigator();

export default function UtilsNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AppSettings" component={AppSettings} />
            <Stack.Screen name="ScanCard" component={ScanCard} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Notifications" component={Notification} />
        </Stack.Navigator>
    );
}
