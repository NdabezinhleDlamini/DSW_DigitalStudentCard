import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from '../Firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../Firebase-config';
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [studentNumber, setStudentNumber] = useState(""); 
    const [loading, setLoading] = useState(false);

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const handleSignIn = async () => {
        setLoading(true); // Start loading
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await setDoc(doc(db, "Users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                studentNumber: studentNumber,
            });

            console.log("User registered:", user.email);
            navigation.navigate("Login"); // go to login
        } catch (error) {
            const errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use. Please use another email.";
            } else if (errorCode === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please choose a stronger password.";
            } else if (errorCode === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (errorCode === 'auth/missing-email') {
                errorMessage = "Email is required.";
            } else if (errorCode === 'auth/operation-not-allowed') {
                errorMessage = "Email/Password accounts are not enabled.";
            } else {
                errorMessage = "An unexpected error occurred. Please try again.";
            }
            Alert.alert("Registration Error", errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // handle registration
    const handleRegister = () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedStudentNumber = studentNumber.trim(); 

        // Validate user input
        if (trimmedFirstName === "" || trimmedLastName === "") {
            Alert.alert("Error", "Name fields cannot be empty");
            return;
        }
        if (trimmedEmail === "") {
            Alert.alert("Error", "Email field cannot be empty");
            return;
        }
        if (!validateStudentNumber(trimmedStudentNumber)) {
            Alert.alert("Error", "Student number must be 9 digits and start with '2'");
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
        if (trimmedConfirmPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
            Alert.alert("Error", "Passwords do not match");
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
                        <View style={styles.namesContainer}>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Student Number"
                            keyboardType="numeric"
                            value={studentNumber}
                            onChangeText={setStudentNumber}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={confirmPassword}
                            autoCapitalize="none"
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                {loading && (
                    <ActivityIndicator size="large" color={Colors.dark.highlight} style={styles.loadingIndicator} />
                )}

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
        width: "90%",
        alignSelf: "center",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    namesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    nameInput: {
        height: 50,
        width: "47.5%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
        alignSelf: "center",
        marginTop: 10,
    },
    input: {
        height: 50,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 20,
        alignSelf: "center",
        marginTop: 15,
    },
    button: {
        backgroundColor: "transparent",
        height: 50,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: "5%",
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
    loadingIndicator: {
        marginTop: 20,
        alignSelf: "center",
    },
});
