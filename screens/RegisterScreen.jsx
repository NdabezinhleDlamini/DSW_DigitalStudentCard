import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    Button,
    ScrollView,
} from "react-native";

import Checkbox from "expo-checkbox";

import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";
import { auth } from "../Firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../Firebase-config";
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
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPrivacyChecked, setPrivacyChecked] = useState(false);

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const handleSignIn = async () => {
        setLoading(true); // Start loading
        try {
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
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

            if (errorCode === "auth/email-already-in-use") {
                errorMessage =
                    "This email is already in use. Please use another email.";
            } else if (errorCode === "auth/weak-password") {
                errorMessage =
                    "Password is too weak. Please choose a stronger password.";
            } else if (errorCode === "auth/invalid-email") {
                errorMessage = "Invalid email format.";
            } else if (errorCode === "auth/missing-email") {
                errorMessage = "Email is required.";
            } else if (errorCode === "auth/operation-not-allowed") {
                errorMessage = "Email/Password accounts are not enabled.";
            } else {
                errorMessage =
                    "An unexpected error occurred. Please try again.";
            }
            Alert.alert("Registration Error", errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleRegister = () => {
        if (!isPrivacyChecked) {
            Alert.alert(
                "Agreement Required",
                "You must agree to the Privacy Policy to register."
            );
            return;
        }

        // Trim whitespace and validate
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedStudentNumber = studentNumber.trim();

        if (trimmedFirstName === "" || trimmedLastName === "") {
            Alert.alert("Error", "Name fields cannot be empty");
            return;
        }
        if (trimmedEmail === "") {
            Alert.alert("Error", "Email field cannot be empty");
            return;
        }
        if (!validateStudentNumber(trimmedStudentNumber)) {
            Alert.alert(
                "Error",
                "Student number must be 9 digits and start with '2'"
            );
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
        if (trimmedPassword.length < 6 || trimmedConfirmPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        handleSignIn();
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateStudentNumber = (studentNumber) =>
        /^2\d{8}$/.test(studentNumber);

    return (
        <>
            <ImageBackground
                style={styles.backgroundImage}
                source={require("../assets/images/Onboarding_Dark.png")}
            >
                <View>
                    <Text style={styles.title}>Verifid</Text>
                    <Text style={styles.subtitle}>Create Your Account</Text>
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
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                >
                    <Checkbox
                        value={isPrivacyChecked}
                        onValueChange={setPrivacyChecked}
                        color={isPrivacyChecked ? "#1e90ff" : undefined}
                    />
                    <Text style={styles.checkboxText}>I agree to the </Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={{ color: "#1e90ff" }}>
                            Terms and Conditions
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator
                            size="small"
                            color="#1e90ff"
                            style={styles.loadingIndicator}
                        />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.hasAccount}>
                    <Text
                        style={{
                            marginRight: 4,
                            color: Colors.dark.text,
                            fontWeight: "bold",
                        }}
                    >
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text
                            style={{
                                textDecorationLine: "underline",
                                color: "#1e90ff",
                                fontWeight: "bold",
                            }}
                        >
                            Log In
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Terms & Conditions
                        </Text>
                        <ScrollView style={styles.modalContent}>
                            <Text
                                style={[
                                    styles.modalText,
                                    { color: Colors.dark.text },
                                ]}
                            >
                                Terms and Conditions for VerifID App
                                {"\n"}Last Updated:{" "}
                                {new Date().toLocaleDateString()}
                            </Text>

                            <Text></Text>

                            <Text
                                style={[
                                    styles.modalText,
                                    { color: Colors.dark.text },
                                ]}
                            >
                                Welcome to the VerifID app! By using our
                                application, you agree to the following terms
                                and conditions. Please read them carefully.
                                {"\n\n"}1. Acceptance of Terms
                                {"\n"}By accessing or using the VerifID app, you
                                agree to be bound by these Terms and Conditions
                                and our Privacy Policy. If you do not agree to
                                these terms, you must not use the app.
                                {"\n\n"}2. Changes to Terms
                                {"\n"}We reserve the right to modify these Terms
                                at any time. Any changes will be effective
                                immediately upon posting the revised terms
                                within the app. Your continued use of the app
                                following any changes signifies your acceptance
                                of the new Terms.
                                {"\n\n"}3. Eligibility
                                {"\n"}You must be at least 16 years old to use
                                this app. By using the app, you represent and
                                warrant that you meet this requirement.
                                {"\n\n"}4. Account Registration
                                {"\n"}To access certain features of the app, you
                                may need to create an account. You agree to
                                provide accurate, current, and complete
                                information during the registration process and
                                to update such information to keep it accurate,
                                current, and complete. You are responsible for
                                maintaining the confidentiality of your account
                                credentials.
                                {"\n\n"}5. User Responsibilities
                                {"\n"}You agree to use the VerifID app in
                                accordance with applicable laws and regulations.
                                You shall not:
                                {"\n"}- Use the app for any unlawful purpose.
                                {"\n"}- Interfere with or disrupt the security,
                                integrity, or performance of the app.
                                {"\n"}- Attempt to gain unauthorized access to
                                the app or its related systems or networks.
                                {"\n"}- Use the app to transmit any harmful or
                                malicious code.
                                {"\n\n"}6. Privacy Policy
                                {"\n"}Your use of the VerifID app is also
                                governed by our Privacy Policy, which outlines
                                how we collect, use, and protect your personal
                                information. By using the app, you consent to
                                our collection and use of your information as
                                described in the Privacy Policy.
                                {"\n\n"}7. Intellectual Property
                                {"\n"}All content within the VerifID app,
                                including but not limited to text, graphics,
                                logos, and software, is the property of the
                                VerifID team or its licensors and is protected
                                by copyright, trademark, and other intellectual
                                property laws. You may not reproduce,
                                distribute, modify, or create derivative works
                                without our prior written permission.
                                {"\n\n"}8. Limitation of Liability
                                {"\n"}To the fullest extent permitted by law,
                                VerifID shall not be liable for any indirect,
                                incidental, special, consequential, or punitive
                                damages arising from or related to your use of
                                the VerifID app. This includes, but is not
                                limited to, damages for loss of profits,
                                goodwill, use, data, or other intangible losses.
                                {"\n\n"}9. Indemnification
                                {"\n"}You agree to indemnify, defend, and hold
                                harmless VerifID, its affiliates, and their
                                respective officers, directors, employees, and
                                agents from any claims, liabilities, damages,
                                losses, or expenses arising out of your use of
                                the app, violation of these Terms, or
                                infringement of any rights of another party.
                                {"\n\n"}10. Governing Law
                                {"\n"}These Terms shall be governed by and
                                construed in accordance with the laws of [Your
                                Jurisdiction], without regard to its conflict of
                                law principles. Any disputes arising from these
                                Terms or your use of the app shall be resolved
                                in the competent courts of [Your Jurisdiction].
                                {"\n\n"}11. Contact Information
                                {"\n"}If you have any questions or concerns
                                about these Terms and Conditions, please contact
                                us at:
                            </Text>
                            <Text
                                style={[
                                    styles.modalText,
                                    { color: Colors.dark.text },
                                ]}
                            >
                                {"\n"}Email: [codecrafters28@gmail.com]
                            </Text>
                        </ScrollView>

                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={isPrivacyChecked}
                                onValueChange={setPrivacyChecked}
                                color={isPrivacyChecked ? "#1e90ff" : undefined} // Change color when checked
                            />
                            <Text
                                style={{
                                    marginLeft: 10,
                                    color: Colors.dark.text,
                                }}
                            >
                                I agree to the Terms & Conditions
                            </Text>
                        </View>
                        <Button
                            title="Close"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </Modal>
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
        borderColor: "#1e90ff",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "500",
        color: "white",
        fontWeight: "bold",
    },
    hasAccount: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loadingIndicator: {
        alignSelf: "center",
    },
    checkboxContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 16,
        color: Colors.dark.text,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark overlay
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e90ff", // Accent color
        marginBottom: 10,
    },
    modalContent: {
        fontSize: 16,
        color: "#fff", // Light text for readability
        marginBottom: 20,
        textAlign: "center",
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#1e90ff", // Accent color
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});
