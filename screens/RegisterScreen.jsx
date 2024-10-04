import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

//Import Firebase Authentication 
import { auth } from '../Firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";

// Import Firebase Firestore
import { db } from '../Firebase-config';
import { addDoc, collection } from "firebase/firestore";

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

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const handleSignIn = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user.email);
                // Add user data to Firestore database
                const userData = {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    StudentNumber: studentNumber,
                    DisplayName: "",
                    CreatedAt: new Date().toISOString(),
                    LastLogin: new Date().toISOString(),
                    LastLoginIP: "",    // Add last login IP
                    LastLoginLocation: "", // Add last login location
                    LastLoginPlatform: "", // Add last login platform
                    ProfilePictureURL: "" // Add Firebase Cloud Storage profile picture URL
                }

                addDoc(collection(db, 'Users'), userData)
                    .then(() => {
                        console.log('User data added to Firestore');
                    })
                    .catch((error) => {
                        console.error('Error adding user data to Firestore:', error);
                    });

                // proceed to login
                navigation.navigate("Login");
            })
            .catch((error) => alert(error.message));
    };

    // handle registration
    const handleRegister = () => {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedStudentNumber = studentNumber.trim(); // Trim student number

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
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
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
});
