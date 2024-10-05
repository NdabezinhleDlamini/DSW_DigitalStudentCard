import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Update the import

import OnboardingScreen from "../screens/OnBoardingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ForgotPasswordScreen";

//Campus Services Screens

import LostAndFound from "../screens/campus services/LostAndFound";
import RequestNewCard from "../screens/campus services/RequestNewCard";
import CardCollection from "../screens/campus services/CardCollection";

//Utils Screens

import AppSettings from "../screens/utils/AppSettings";
import EditProfile from "../screens/utils/EditProfile";
import ScanCard from "../screens/utils/ScanCard";

import TabNavigator from "../components/TabNavigator";
import ServicesNavigator from "./ServicesNavigator";
import UtillsNavigator from "./UtilsNavigator";

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
            <Stack.Screen name="Services" component={ServicesNavigator} />
            <Stack.Screen name="Utils" component={UtillsNavigator} />
        </Stack.Navigator>
    );
}
