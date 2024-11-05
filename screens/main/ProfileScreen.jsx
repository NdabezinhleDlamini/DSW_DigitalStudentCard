import React, { useContext, useState, useEffect } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    ImageBackground,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeContext } from "../../contexts/ThemeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Layout } from "../../constants/Layout";
import { Fonts } from "../../constants/Fonts";

import { db } from "../../Firebase-config";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";

import { registerIndieID, unregisterIndieDevice } from "native-notify";
import axios from "axios";

const lightBackground = require("../../assets/images/Onbaording_Light.png");
const darkBackground = require("../../assets/images/Onboarding_Dark.png");

export default function UserProfileScreen({ navigation }) {
    registerIndieID(userLoginData?.uid, 24451, "9MBVb21BgXTmYIiNxD53bg");

    const { currentColors, isDarkMode } = useContext(ThemeContext); // Get theme state from context
    const [modalVisible, setModalVisible] = useState(false);

    const [activityLogs, setActivityLogs] = useState([]);

    const [location, setLocation] = useState("Unknown");

    const campuses = ["UJ-APB", "UJ-APK", "UJ-DFC", "UJ-SWC"];
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    const [userLoginData, setUserLoginData] = useState(null);

    useEffect(() => {
        const getUserLoginData = async () => {
            try {
                const data = await AsyncStorage.getItem("auth");
                if (data) {
                    setUserLoginData(JSON.parse(data));
                }
            } catch (error) {
                console.error("Error getting user login data:", error);
            }
        };
        getUserLoginData();
    }, []);

    useEffect(() => {
        if (userLoginData && userLoginData.uid) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "Users", userLoginData.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserLoginData((prevData) => ({
                            ...prevData,
                            ...docSnap.data(),
                        }));
                    } else {
                        console.log("User data not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [userLoginData?.uid]);

    const handlePost = async () => {
        if (!location) {
            // Change from location to lastSeen
            Alert.alert("Please select a location");
            return;
        }

        if (!userLoginData) {
            Alert.alert("User data not loaded yet, please wait");
            return;
        }

        try {
            const newPost = {
                itemName: "Student Card",
                Location: location,
                description: "Student Card",
                itemType: "Card",
                ["Student Number"]: userLoginData.studentNumber,
                Status: "Lost",
                itemType: "Card",
                Date: new Date().toLocaleDateString(),
            };

            const postCollection = collection(db, "lost-Reports");
            await addDoc(postCollection, newPost);

            Alert.alert("Success", "Post added successfully");
            toggleModal();
            notify();
        } catch (error) {
            console.error("Error adding post:", error);
            Alert.alert(
                "Error",
                "There was a problem reporting the lost card. Please try again."
            );
        }
    };

    const handleLastSeen = (location) => {
        setLocation(location);
    };

    const notify = (bigPictureURL) => {
        axios
            .post(`https://app.nativenotify.com/api/notification`, {
                appId: 24451,
                appToken: "9MBVb21BgXTmYIiNxD53bg",
                title: "BOLO: Lost Item",
                body: "Lost Student Card Reported. Last seen at " + location,
                // pushData: { itemName, location, date },
                bigPictureURL: bigPictureURL,
            })
            .then((response) => {
                console.log(
                    "Push notification sent successfully:",
                    response.data
                );
            })
            .catch((error) => {
                console.error("Error sending push notification:", error);
            });
    };

    useEffect(() => {
        if (!userLoginData?.studentNumber) return;

        const logsQuery = query(
            collection(db, "ActivityLogs"),
            where("studentNumber", "==", userLoginData.studentNumber)
        );

        const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
            const logs = [];
            querySnapshot.forEach((doc) => {
                logs.push({ id: doc.id, ...doc.data() });
            });
            setActivityLogs(logs);
        });

        return () => unsubscribe();
    }, [userLoginData?.studentNumber]);

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.notificationItem,
                { backgroundColor: currentColors.settingGroupBackground },
            ]}
        >
            <View style={styles.iconContainer}>
                <MaterialIcons
                    name="account-circle"
                    size={40}
                    color={currentColors.secondaryText}
                />
            </View>
            <View style={styles.notificationContent}>
                <Text
                    style={[styles.usernameText, { color: currentColors.text }]}
                >
                    {item.title}
                </Text>
                <Text
                    style={[
                        styles.notificationText,
                        { color: currentColors.text },
                    ]}
                >
                    {item.message} {/* Use existing message field */}
                </Text>
                <Text style={[styles.timestampText, { color: "#888" }]}>
                    {item.date}
                </Text>
            </View>
        </View>
    );

    return (
        <ImageBackground
            source={isDarkMode ? darkBackground : lightBackground}
            resizeMode="cover"
            style={styles.backgroundImage}
        >
            <SafeAreaView style={[styles.container]}>
                <View style={styles.header}>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Home Alt")}
                        >
                            <Text
                                style={[
                                    styles.headerText,
                                    {
                                        color: currentColors.text,
                                        fontFamily: "ThedusWideLight",
                                    },
                                ]}
                            >
                                VerifID
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.notificationContainer}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 15 }}
                                onPress={() =>
                                    navigation.navigate("Utils", {
                                        screen: "Notifications",
                                    })
                                }
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={24}
                                    color={currentColors.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 5 }}
                                onPress={() =>
                                    navigation.navigate("Utils", {
                                        screen: "AppSettings",
                                    })
                                }
                            >
                                <Ionicons
                                    name="settings-outline"
                                    size={24}
                                    color={currentColors.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Profile Header Section */}
                    <View style={styles.headerSection}>
                        <Image
                            style={styles.headerImage}
                            source={
                                isDarkMode ? lightBackground : darkBackground
                            }
                        />
                        <View
                            style={[
                                styles.profileImageWrapper,
                                {
                                    borderColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                        >
                            <Image
                                style={styles.profileImage}
                                source={
                                    userLoginData?.profilePic
                                        ? { uri: userLoginData.profilePic }
                                        : {
                                              uri: "https://via.placeholder.com/100",
                                          }
                                }
                            />
                        </View>
                    </View>

                    {/* User Info Section */}
                    <View style={styles.infoSection}>
                        <Text
                            style={[
                                styles.nameText,
                                { color: currentColors.text },
                            ]}
                        >
                            {userLoginData?.firstName} {userLoginData?.lastName}
                        </Text>
                        <Text style={[styles.idText, { color: "#777" }]}>
                            @{userLoginData?.studentNumber}
                        </Text>
                    </View>

                    {/* Report Lost Card Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.reportButton,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    { color: currentColors.primaryButtonText },
                                ]}
                            >
                                Report Lost Card
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Activity Timeline */}
                    <View style={styles.activitySection}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: currentColors.text },
                            ]}
                        >
                            Recent Activities
                        </Text>
                        <ScrollView contentContainerStyle={styles.historyContainer}>
                            <View>
                                {activityLogs.slice(0, 5).map((log) => (
                                    <View
                                        key={log.id}
                                        style={[styles.historyItem, { backgroundColor: currentColors.settingGroupBackground }]}
                                    >
                                        <Text style={[styles.historyItemAction, { color: currentColors.text }]}>
                                            {log.action}
                                        </Text>
                                        <Text style={[styles.historyItemDetails, { color: currentColors.text }]}>
                                            Details: {log.details}
                                        </Text>
                                        <Text style={[styles.historyItemResult, { color: currentColors.text }]}>
                                            Result: {log.result}
                                        </Text>
                                        <Text
                                            style={[styles.historyItemTimestamp, { color: "#888" }]}
                                        >
                                            Timestamp:{" "}
                                            {log.timestamp
                                                .toDate()
                                                .toLocaleString()}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        {/* Add more activities here */}
                    </View>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={toggleModal}
                >
                    <View style={styles.modalOverlay}>
                        <View
                            style={[
                                styles.modalCard,
                                { backgroundColor: currentColors.background },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modalTitle,
                                    { color: currentColors.text },
                                ]}
                            >
                                Report Lost Card
                            </Text>

                            <View style={styles.studentDetailsContainer}>
                                <Text
                                    style={[
                                        styles.modalUserName,
                                        { color: currentColors.text },
                                    ]}
                                >
                                    {userLoginData?.firstName}{" "}
                                    {userLoginData?.lastName}
                                </Text>
                                <Text style={styles.modalStudentNumber}>
                                    Student ID: {userLoginData?.studentNumber}
                                </Text>
                                <Text style={{ color: "#777" }}>
                                    Last Seen: {location}
                                </Text>
                            </View>
                            <FlatList
                                data={campuses}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => handleLastSeen(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                { color: currentColors.text },
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.reportButton,
                                        {
                                            backgroundColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={handlePost}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: currentColors.primaryButtonText,
                                            },
                                        ]}
                                    >
                                        Report
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.cancelButton,
                                        {
                                            borderColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={toggleModal}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                color: currentColors.primaryButtonBackground,
                                            },
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingHorizontal: Layout.padding,
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: Layout.margin,
    },
    notificationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        ...Fonts.subtitle,
        fontSize: 24,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    headerSection: {
        width: "100%",
        position: "relative",
    },
    headerImage: {
        width: "100%",
        height: 150,
        opacity: 0.8,
        resizeMode: "stretch",
    },
    profileImageWrapper: {
        position: "absolute",
        bottom: -50,
        left: 20,
        borderWidth: 3,
        borderRadius: 50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    infoSection: {
        marginTop: 60,
        paddingHorizontal: 20,
    },
    nameText: {
        fontSize: 22,
        fontWeight: "bold",
    },
    idText: {
        fontSize: 16,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    reportButton: {
        borderRadius: 8,
        width: "100%",
        backgroundColor: "#1e90ff",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    activitySection: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    activityItem: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    activityText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalCard: {
        width: "85%",
        borderRadius: 15,
        padding: 25,
        alignItems: "center",
        elevation: 5, // adds subtle shadow for Android
        shadowColor: "#000", // shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    studentDetailsContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    modalUserName: {
        fontSize: 20,
        fontWeight: "600",
    },
    modalStudentNumber: {
        fontSize: 16,
        color: "#777",
        marginTop: 5,
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    reportButton: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        marginRight: 5,
        alignItems: "center",
    },
    cancelButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1.5,
        paddingVertical: 12,
        marginLeft: 5,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    option: {
        padding: 15,
    },
    optionText: {
        fontSize: 16,
    },
    historyContainer: {
        // paddingHorizontal: 20,
        marginBottom: 20,
    },
    historyItem: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    historyItemAction: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        fontWeight: "900",
    },
    historyItemDetails: {
        fontSize: 14,
        marginBottom: 4,
    },
    historyItemResult: {
        fontSize: 14,
        fontStyle: "italic",
        marginBottom: 4,
    },
    historyItemTimestamp: {
        fontSize: 12,
        marginTop: 6,
    },
});
