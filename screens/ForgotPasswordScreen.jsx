import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import React, { useState, useContext } from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from "../Firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { AuthContext } from "@/contexts/AuthContext";

export default function ResetPasswordScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    const { resetAttemptCount } = useContext(AuthContext);
    const [email, setEmail] = useState("");

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Success");

            resetAttemptCount();
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.message);
            console.error("Error sending password reset email: ", error);
        }
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
                        <Text style={styles.subtitle}>Reset Your Password</Text>
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handlePasswordReset}
                        >
                            <Text style={styles.buttonText}>
                                Send Reset Link
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.hasAccount}>
                    <Text style={{ marginRight: 4, color: Colors.dark.text }}>
                        Remember your password?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Login");
                        }}
                    >
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: "#1e90ff",
                            }}
                        >
                            Log In
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
        width: "90%",
        alignSelf: "center",
    },
    label: {
        fontSize: 15,
        fontWeight: "500",
        color: Colors.dark.text,
        marginTop: 20,
    },
    input: {
        height: 50,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
        alignSelf: "center",
        marginTop: 10,
    },
    button: {
        backgroundColor: "transparent",
        height: 50,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
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
