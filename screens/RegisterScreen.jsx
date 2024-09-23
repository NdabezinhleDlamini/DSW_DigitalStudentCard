import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from '../Firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [studentNumber, setStudentNumber] = useState(""); // Add state for student number

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const handleSignIn = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user.email);
                // proceed to login
                navigation.navigate("Login");
            })
            .catch((error) => alert(error.message));
    };

    // handle registration
    const handleRegister = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedStudentNumber = studentNumber.trim(); // Trim student number

        // Validate user input
        if (trimmedName === "") {
            Alert.alert("Error", "Name field cannot be empty");
            return;
        }
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
        if (!validateStudentNumber(trimmedStudentNumber)) {
            Alert.alert("Error", "Student number must be 9 digits and start with '2'");
            return;
        }

        handleSignIn();
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateStudentNumber = (studentNumber) => {
        // Ensure student number is 9 digits long and starts with '2'
        const studentNumberRegex = /^2\d{8}$/;
        return studentNumberRegex.test(studentNumber);
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
                        <Text style={styles.subtitle}>Create Your Account</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Text style={styles.label}>Student Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Student Number"
                            keyboardType="numeric"
                            value={studentNumber}
                            onChangeText={setStudentNumber}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <View style={styles.hasAccount}>
                    <Text style={{ marginRight: 4, color: Colors.dark.text }}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Login");
                        }}
                    >
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: Colors.dark.highlight,
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
