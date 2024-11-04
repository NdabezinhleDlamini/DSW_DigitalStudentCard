import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Alert,
    Modal,
    FlatList,
    Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React, { useState, useContext, useEffect } from "react";
import { db } from "../../Firebase-config";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "@/contexts/ThemeContext";

const lightBackground = require("../../assets/images/Onbaording_Light.png");
const darkBackground = require("../../assets/images/Onboarding_Dark.png");

const generateTransactionId = () => {
    return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

export default function RequestNewCard() {
    const { currentColors, isDarkMode } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [student, setStudent] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});
    const [isCardPending, setIsCardPending] = useState(false);
    const [isCardReady, setIsCardReady] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [paymentOption, setPaymentOption] = useState("in-app");
    const [campusModalVisible, setCampusModalVisible] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const campuses = [
        { label: "University of Johannesburg APK", value: "uj_apk" },
        { label: "University of Johannesburg APB", value: "uj_apb" },
        { label: "University of Johannesburg DFC", value: "uj_dfc" },
        { label: "University of Johannesburg SWC", value: "uj_swc" },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDocRef = doc(db, "Users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.firstName);
                    setSurname(userData.lastName);
                    setStudent(userData.studentNumber);
                    checkExistingRequest(userData.studentNumber);
                } else {
                    console.log("No such user document!");
                }
            }
        };
        fetchUserData();
    }, [user]);

    const checkExistingRequest = async (studentNumber) => {
        const q = query(
            collection(db, "cardRequests"),
            where("Student_No", "==", studentNumber)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            setIsButtonDisabled(true);
            const cardData = querySnapshot.docs[0].data();
            setIsCardPending(cardData.Status === "Pending");
            setIsCardReady(cardData.Status === "Ready to Collect");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!cardNumber || !/^\d{16}$/.test(cardNumber))
            newErrors.cardNumber = "Invalid card number";
        if (!expiration || !/^\d{2}\/\d{2}$/.test(expiration))
            newErrors.expiration = "Invalid expiration date (MM/YY)";
        if (!cvv || !/^\d{3}$/.test(cvv)) newErrors.cvv = "Invalid CVV";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!selectedCampus) {
            Alert.alert("Error", "Please select a campus.");
            return;
        }

        if (paymentOption === "in-app" && !validateForm()) return;

        try {
            const transactionId = generateTransactionId();
            const paymentInfo =
                paymentOption === "in-app"
                    ? {
                          Last_Four: cardNumber.slice(-4),
                          Expiration: expiration,
                      }
                    : null;

            await addDoc(collection(db, "cardRequests"), {
                Name: name,
                Surname: surname,
                Student_No: student,
                Transaction_ID: transactionId,
                Payment_Info: paymentInfo,
                Status: "Pending",
                Campus: selectedCampus,
                Payment_Option: paymentOption,
            });

            setCardNumber("");
            setExpiration("");
            setCvv("");
            setErrors({});
            Alert.alert("Thank You.", "Request Submitted");
            navigation.goBack();
        } catch (error) {
            console.log(error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: "Error: Could not save the data.",
            }));
        }
    };

    const handleSelectCampus = (item) => {
        setSelectedCampus(item.label);
        setModalVisible(false);
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
                        onPress={() => navigation.goBack()}
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
                    <Text
                        style={[
                            styles.sectionHeading,
                            { color: currentColors.text },
                        ]}
                    >
                        Student Details
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor:
                                    currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Name"
                        placeholderTextColor="#777"
                        value={name}
                        editable={false}
                    />
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor:
                                    currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Surname"
                        placeholderTextColor="#777"
                        value={surname}
                        editable={false}
                    />
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor:
                                    currentColors.primaryButtonBackground,
                                backgroundColor: currentColors.inputBackground,
                            },
                        ]}
                        placeholder="Student Number"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                        value={student}
                        editable={false}
                    />

                    <View style={styles.statusContainer}>
                        {isCardPending && (
                            <View
                                style={[styles.statusMessage, styles.pending]}
                            >
                                <MaterialIcons
                                    name="hourglass-empty"
                                    size={24}
                                    color="#FFA500"
                                />
                                <Text style={styles.statusText}>
                                    Status: Card Request Pending
                                </Text>
                            </View>
                        )}
                        {isCardReady && (
                            <View style={[styles.statusMessage, styles.ready]}>
                                <MaterialIcons
                                    name="check-circle"
                                    size={24}
                                    color="#32CD32"
                                />
                                <Text style={styles.statusText}>
                                    Status: Card Ready to Collect
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text
                        style={[
                            styles.sectionHeading,
                            { color: currentColors.text },
                        ]}
                    >
                        Payment Option
                    </Text>
                    <View style={styles.segmentedControl}>
                        <Pressable
                            style={[
                                styles.segment,
                                paymentOption === "in-app" &&
                                    styles.selectedSegment,
                            ]}
                            onPress={() => setPaymentOption("in-app")}
                        >
                            <Text style={styles.segmentText}>
                                In-App Payment
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.segment,
                                paymentOption === "at campus" &&
                                    styles.selectedSegment,
                            ]}
                            onPress={() => setPaymentOption("at campus")}
                        >
                            <Text style={styles.segmentText}>
                                Pay at Campus
                            </Text>
                        </Pressable>
                    </View>

                    {/* Campus Selection */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>
                            {selectedCampus || "Select your campus"}
                        </Text>
                    </TouchableOpacity>

                    {/* Modal for Campus Selection */}
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.optionText}>
                                    Select Campus
                                </Text>
                                <FlatList
                                    style={styles.modalList}
                                    data={campuses}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={() =>
                                                handleSelectCampus(item)
                                            }
                                        >
                                            <Text style={styles.optionText}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Conditionally render payment details button */}
                    {paymentOption === "in-app" && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Text style={styles.buttonText}>
                                Add Payment Details
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Modal for Payment Form */}
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="slide"
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.optionText}>
                                    Payment Details
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                currentColors.primaryButtonBackground,
                                            backgroundColor:
                                                currentColors.inputBackground,
                                        },
                                    ]}
                                    placeholder="Card Number"
                                    placeholderTextColor="#777"
                                    keyboardType="numeric"
                                    value={cardNumber}
                                    onChangeText={(text) => {
                                        setCardNumber(text);
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            cardNumber: "",
                                        }));
                                    }}
                                />
                                {errors.cardNumber && (
                                    <Text style={styles.errorText}>
                                        {errors.cardNumber}
                                    </Text>
                                )}

                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                currentColors.primaryButtonBackground,
                                            backgroundColor:
                                                currentColors.inputBackground,
                                        },
                                    ]}
                                    placeholder="Expiration (MM/YY)"
                                    placeholderTextColor="#777"
                                    value={expiration}
                                    onChangeText={(text) => {
                                        setExpiration(text);
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            expiration: "",
                                        }));
                                    }}
                                />
                                {errors.expiration && (
                                    <Text style={styles.errorText}>
                                        {errors.expiration}
                                    </Text>
                                )}

                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                currentColors.primaryButtonBackground,
                                            backgroundColor:
                                                currentColors.inputBackground,
                                        },
                                    ]}
                                    placeholder="CVV"
                                    placeholderTextColor="#777"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    value={cvv}
                                    onChangeText={(text) => {
                                        setCvv(text);
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            cvv: "",
                                        }));
                                    }}
                                />
                                {errors.cvv && (
                                    <Text style={styles.errorText}>
                                        {errors.cvv}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        handleSubmit();
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.closeButtonText}>
                                        Submit Payment
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setIsModalVisible(false)} // Close modal
                                >
                                    <Text style={styles.closeButtonText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.buttonText}>Submit Request</Text>
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
    sectionHeading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
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
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        width: "90%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        alignSelf: "flex-start",
        marginLeft: "5%",
    },
    statusContainer: {
        marginBottom: 10,
        width: "90%",
        alignItems: "flex-start",
    },

    statusMessage: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        width: "100%",
    },

    pending: {
        backgroundColor: "#FFF3CD",
        borderColor: "#FFC107",
        borderWidth: 1,
    },

    ready: {
        backgroundColor: "#DFF2BF",
        borderColor: "#4BB543",
        borderWidth: 1,
    },

    statusText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        fontWeight: "500",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
    },
    option: {
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
    },
    optionText: {
        fontSize: 18,
        color: "#333",
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#1e90ff",
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    segmentedControl: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%",
        marginBottom: 20,
    },
    segment: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#b0b0b0",
        alignItems: "center",
    },
    selectedSegment: {
        backgroundColor: "#007bff",
    },
    segmentText: {
        color: "#fff",
    },
});
