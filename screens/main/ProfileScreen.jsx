import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";

import { useFonts } from "expo-font";

export default function UserProfileScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Text style={{ fontSize: 24, fontFamily: "ThedusWideLight", color: Colors.light.tint }}>VerifID</Text>
                    </TouchableOpacity>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={Colors.light.tint} // Using the tint color
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 5 }}>
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={Colors.light.tint} // Using the tint color
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
                        source={{ uri: "https://via.placeholder.com/500x150" }} // Placeholder for header background
                    />
                    <View style={styles.profileImageWrapper}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: "https://via.placeholder.com/100" }} // Placeholder for Profile Picture
                        />
                    </View>
                </View>

                {/* User Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.nameText}>John Doe</Text>
                    <Text style={styles.idText}>@johndoe</Text>
                </View>

                {/* Report Lost Card Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.reportButton}
                        onPress={() => navigation.navigate("ReportLostCard")}
                    >
                        <Text style={styles.buttonText}>Report Lost Card</Text>
                    </TouchableOpacity>
                </View>

                {/* Activity Timeline (Like Twitter's feed) */}
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Recent Activities</Text>
                    <View style={styles.activityItem}>
                        <Text style={styles.activityText}>
                            Accessed the Library
                        </Text>
                        <Text style={styles.timestamp}>2 hours ago</Text>
                    </View>
                    <View style={styles.activityItem}>
                        <Text style={styles.activityText}>
                            Lost card reported
                        </Text>
                        <Text style={styles.timestamp}>1 day ago</Text>
                    </View>
                    <View style={styles.activityItem}>
                        <Text style={styles.activityText}>
                            Gym Access Granted
                        </Text>
                        <Text style={styles.timestamp}>3 days ago</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background, // Using the background color from Colors
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
        ...Fonts.subtitle, // Using the subtitle font size and weight
        color: Colors.light.text, // Using the text color
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
    },
    profileImageWrapper: {
        position: "absolute",
        bottom: -50,
        left: 20,
        borderWidth: 3,
        borderColor: "#f1faee",
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
        color: "#0b132b",
    },
    idText: {
        fontSize: 16,
        color: "#777",
    },
    statsSection: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
    statBox: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0b132b",
    },
    statLabel: {
        fontSize: 14,
        color: "#777",
    },
    bioSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    bioText: {
        fontSize: 16,
        color: "#0b132b",
        fontStyle: "italic",
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    reportButton: {
        backgroundColor: Colors.light.background, // Amber color from your theme
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "red",
        width: "100%",
    },
    buttonText: {
        color: "red",
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
        color: "#0b132b",
        marginBottom: 10,
    },
    activityItem: {
        backgroundColor: "#edf6f9",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    activityText: {
        fontSize: 16,
        color: "#0b132b",
    },
    timestamp: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },
});
