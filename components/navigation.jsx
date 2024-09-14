import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Update the import

import OnboardingScreen from "../screens/OnBoardingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ForgotPasswordScreen";

import TabNavigator from "../components/TabNavigator";

const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
        >
            {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ResetPasswordScreen} /> */}
            <Stack.Screen name="main" component={TabNavigator} />
        </Stack.Navigator>
    );
}
