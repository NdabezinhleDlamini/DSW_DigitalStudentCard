import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

export default function OnBoardingScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

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
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                        />
                        <TouchableOpacity onPress={() => {navigation.navigate("ForgotPassword")}}>
                            <Text style={styles.forgotPassword}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Homescreen");
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
                                color: Colors.dark.highlight,
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
        width: "75%",
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: 10,
        color: Colors.dark.highlight,
        textDecorationLine: "underline",
    },
    button: {
        backgroundColor: "transparent",
        height: 50,
        width: "75%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        alignSelf: "center",
        borderWidth: 1.5,
        borderColor: Colors.dark.highlight,
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
