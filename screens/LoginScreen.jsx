import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

import { Platform } from "react-native";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from '../Firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../Firebase-config'; // Import Firestore instance
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions

export default function OnBoardingScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const login = () => {
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then(userCredential => {
    //             // Signed in
    //             const user = userCredential.user;
    //             console.log("User logged in:", user.email);
    //             // go to home page
    //             navigation.navigate("main");
    //         })
    //         .catch(error => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             Alert.alert("Login Error", errorMessage);
    //         });
    // }

    //last login
    const getLastLoginDetails = async () => {
        // Get current time
        const lastLoginTime = new Date().toISOString();
        
        // Fetch IP address
        let ipAddress;
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipAddress = data.ip;
        } catch (error) {
            console.error("Failed to fetch IP address:", error);
            ipAddress = "Unavailable";
        }

        // Fetch location from IP address
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

    const login = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const platform = Platform.OS;

            console.log("User logged in:", user.email);

            // Get last login details
            const { lastLoginTime, ipAddress, lastLoginLocation } = await getLastLoginDetails();

            // Update user document with last login details
            await updateDoc(doc(db, "Users", user.uid), {
                LastLoginTime: lastLoginTime,
                LastLoginIP: ipAddress,
                LastLoginLocation: lastLoginLocation,
                LastLoginPlatform: platform,
            });

            navigation.navigate("main"); // Go to home page
        } catch (error) {
            const errorMessage = error.message;
            Alert.alert("Login Error", errorMessage);
        }
    };

    // hanle login
    const handleLogin = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        //validate user input
        if (trimmedEmail === "") {
            Alert.alert("Error", "Email field cannot be empty");
            return;
        }
        if (!validateEmail(trimmedEmail)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }
        if (trimmedPassword === "") {
            Alert.alert("Error", "Password field cannot be empty");
            return;
        }
        if (trimmedPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }

        login();
        // navigation.navigate("main");
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
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // navigation.navigate("Homescreen");
              handleLogin();
            }}
          >
            <Text style={styles.buttonText}>Log In</Text>
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
