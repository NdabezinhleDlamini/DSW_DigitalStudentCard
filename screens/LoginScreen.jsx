import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Button,
    Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from "../Firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../Firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

export default function OnBoardingScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const { login } = useContext(AuthContext); // Use login from context

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const getLastLoginDetails = async () => {
        const lastLoginTime = new Date().toISOString();

        let ipAddress;
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            ipAddress = data.ip;
        } catch (error) {
            console.error("Failed to fetch IP address:", error);
            ipAddress = "Unavailable";
        }

        let lastLoginLocation = "Location unavailable";
        try {
            const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
            const locationData = await response.json();
            if (locationData.city && locationData.region) {
                lastLoginLocation = `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
            } else {
                lastLoginLocation = "Unable to determine location";
            }
        } catch (error) {
            console.error("Location fetching error:", error);
        }

        return { lastLoginTime, ipAddress, lastLoginLocation };
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            const platform = Platform.OS;
            const { lastLoginTime, ipAddress, lastLoginLocation } =
                await getLastLoginDetails();

            await updateDoc(doc(db, "Users", user.uid), {
                LastLoginTime: lastLoginTime,
                LastLoginIP: ipAddress,
                LastLoginLocation: lastLoginLocation,
                LastLoginPlatform: platform,
            });

            // Save login details to context and AsyncStorage
            login({ email, uid: user.uid }); // Use login from context to store auth data

            navigation.navigate("main");
        } catch (error) {
            Alert.alert("Login Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            <StatusBar
                style="dark"
                translucent={true}
                backgroundColor="rgba(0,0,0,0)"
            />
            <ImageBackground
                style={styles.backgroundImage}
                source={require("../assets/images/Onboarding_Dark.png")}
            >
                <View>
                    <View>
                        <Text style={styles.title}>Verifid</Text>
                        <Text style={styles.subtitle}>Welcome Back!</Text>
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ForgotPassword");
                            }}
                        >
                            <Text style={styles.forgotPassword}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: "#ccc" }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.hasAccount}>
                    <Text style={{ marginRight: 4, color: Colors.dark.text }}>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Register");
                        }}
                    >
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: "#1e90ff",
                            }}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    title: {
        fontFamily: "ThedusWideLight",
        fontSize: 70,
        color: "#fff",
        textAlign: "center",
        marginTop: 50,
    },
    subtitle: {
        marginVertical: 5,
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
    },
    form: {
        marginTop: 20,
        alignItems: "left",
        width: "90%",
        alignSelf: "center",
    },
    input: {
        height: 50,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
        alignSelf: "center",
        marginTop: 20,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: 20,
        color: "#1e90ff",
        textDecorationLine: "underline",
    },
    button: {
        backgroundColor: "transparent",
        height: 50,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20,
        alignSelf: "center",
        borderWidth: 1.5,
        borderColor: "#1e90ff",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "500",
        color: "white",
    },
    hasAccount: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
