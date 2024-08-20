import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Update the import

import OnboardingScreen from "../screens/OnBoardingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import Homescreen from "../screens/Homescreen";

const Stack = createStackNavigator(); // This stays the same

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Homescreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Homescreen" component={Homescreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}