import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
import { db } from "../../Firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/contexts/ThemeContext";

const lightBackground = require("../../assets/images/Onbaording_Light.png");
const darkBackground = require("../../assets/images/Onboarding_Dark.png");

export default function RequestNewCard() {
    const { currentColors, isDarkMode } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [student, setStudent] = useState("");
    const [errors, setErrors] = useState({});

    const validateStudentNumber = (input) => /^2\d{8}$/.test(input);

    const validateForm = () => {
        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!surname) newErrors.surname = "Surname is required";
        if (!student) {
            newErrors.student = "Student number is required";
        } else if (!validateStudentNumber(student)) {
            newErrors.student =
                "Student number must start with '2' and be 9 digits long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            await addDoc(collection(db, "cardRequests"), {
                Name: name,
                Surname: surname,
                Student_No: student,
            });

            // Reset form on successful submission
            setName("");
            setSurname("");
            setStudent("");
            setErrors({});
            navigation.navigate("Homescreen");
        } catch (error) {
            console.log(error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: "Error: Could not save the data.",
            }));
        }
    };

    return (
        <ImageBackground
            source={isDarkMode ? darkBackground : lightBackground}
            style={styles.backgroundImage}
        >
            <StatusBar
                style={isDarkMode ? "light" : "dark"}
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                translucent={true}
                backgroundColor={currentColors.background}
            />

            <View style={[styles.container]}>
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Homescreen")}
                        style={styles.backButtonContainer}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={currentColors.text}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: currentColors.text }]}>
                        Request Student Card
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: errors.name
                                    ? "red"
                                    : currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Name"
                        placeholderTextColor="#777"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                name: "",
                            }));
                        }}
                    />
                    {errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: errors.surname
                                    ? "red"
                                    : currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Surname"
                        placeholderTextColor="#777"
                        value={surname}
                        onChangeText={(text) => {
                            setSurname(text);
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                surname: "",
                            }));
                        }}
                    />
                    {errors.surname && (
                        <Text style={styles.errorText}>{errors.surname}</Text>
                    )}

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: errors.student
                                    ? "red"
                                    : currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Student Number"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                        value={student}
                        onChangeText={(text) => {
                            setStudent(text);
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                student: "",
                            }));
                        }}
                    />
                    {errors.student && (
                        <Text style={styles.errorText}>{errors.student}</Text>
                    )}

                    {errors.general && (
                        <Text style={styles.errorText}>{errors.general}</Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor:
                                    currentColors.primaryButtonBackground,
                            },
                        ]}
                        onPress={handleSubmit}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: currentColors.primaryButtonText },
                            ]}
                        >
                            Submit Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 15,
    },
    backButtonContainer: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    input: {
        height: 50,
        width: "90%",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 30,
        width: "90%",
        height: 50,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        alignSelf: "flex-start",
        marginLeft: "5%",
    },
});
