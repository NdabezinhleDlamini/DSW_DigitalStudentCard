import { createStackNavigator } from "@react-navigation/stack";

import AppSettings from "../screens/utils/AppSettings";
import ScanCard from "../screens/utils/ScanCard";
import Notification from "../screens/utils/Notifications";

import PostItemScreen from "../screens/campus services/PostItemScreen";

const Stack = createStackNavigator();

export default function UtilsNavigator() {
<<<<<<< HEAD
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppSettings" component={AppSettings} />
      <Stack.Screen name="ScanCard" component={ScanCard} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Notifications" component={Notification} />
    </Stack.Navigator>
  );
=======
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AppSettings" component={AppSettings} />
            <Stack.Screen name="ScanCard" component={ScanCard} />
            <Stack.Screen name="Notifications" component={Notification} />
        </Stack.Navigator>
    );
>>>>>>> 493f6a47b88a17d287f1d9fdf00bfb3cf428b621
}
