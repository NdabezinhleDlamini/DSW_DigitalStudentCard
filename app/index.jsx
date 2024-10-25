import React, { useState, useEffect } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider, AuthContext } from "../contexts/AuthContext"; // Ensure correct import
import Navigation from "../components/navigation";
import TabNavigator from "@/components/TabNavigator";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";

export default function App() {
    const [isShowSplash, setIsShowSplash] = useState(true);
    const [auth, setAuth] = useState(null); // Track auth state locally

    // Show splash screen for a short period
    useEffect(() => {
        const splashTimeout = setTimeout(() => {
            setIsShowSplash(false);
        }, 3000);

        return () => clearTimeout(splashTimeout); // Cleanup timeout on unmount
    }, []);

    return (
        <AuthProvider>
            <ThemeProvider>
                {isShowSplash ? (
                    <SplashScreen />
                ) : (
                    <AuthContext.Consumer>
                        {({ auth }) =>
                            auth ? <TabNavigator /> : <Navigation />
                        }
                    </AuthContext.Consumer>
                )}
            </ThemeProvider>
        </AuthProvider>
    );
}
