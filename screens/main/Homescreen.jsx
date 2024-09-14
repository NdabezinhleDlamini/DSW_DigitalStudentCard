import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";

export default function Homescreen() {
    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity>
                            <Ionicons
                                name="person-circle-outline"
                                size={24}
                                color={Colors.light.tint} // Using the tint color
                            />
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

                    {/* Current Campus */}
                    <Text style={styles.headerText}>Current Campus</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>My ID</Text>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: "https://placehold.co/600x400/png" }}
                            style={styles.studentCard}
                        />
                    </TouchableOpacity>
                    <Text style={styles.idText}>219110401</Text>
                </View>
                {/* Campus Services Quick Link icons */}
                <View>
                    <Text style={styles.sectionTitle}>Campus Services</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.campusServiceItem}>
                            <Text>Access Control</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.campusServiceItem}>
                            <Text>Access Control</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.campusServiceItem}>
                            <Text>Access Control</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.campusServiceItem}>
                            <Text>Access Control</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Access History Quick Link icons */}
                <View>
                    <Text style={styles.sectionTitle}>Access History</Text>
                    {/* Access istory Items */}
                    <ScrollView horizontal={true}>
                        <TouchableOpacity style={styles.accessHistoryCard}>
                            <Image
                                source={require("../../assets/icons/history.png")}
                                style={styles.accessHistoryCardIcon}
                            />
                            <View style={styles.accessHistoryCardDetails}>
                                <Text
                                    style={styles.accessHistoryCardDetailsTitle}
                                >
                                    Bunting
                                </Text>
                                <Text
                                    style={
                                        styles.accessHistoryCardDetailsSubTitle
                                    }
                                >
                                    APB
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accessHistoryCard}>
                            <Image
                                source={require("../../assets/icons/history.png")}
                                style={styles.accessHistoryCardIcon}
                            />
                            <View style={styles.accessHistoryCardDetails}>
                                <Text
                                    style={styles.accessHistoryCardDetailsTitle}
                                >
                                    Kingsway
                                </Text>
                                <Text
                                    style={
                                        styles.accessHistoryCardDetailsSubTitle
                                    }
                                >
                                    APK
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accessHistoryCard}>
                            <Image
                                source={require("../../assets/icons/history.png")}
                                style={styles.accessHistoryCardIcon}
                            />
                            <View style={styles.accessHistoryCardDetails}>
                                <Text
                                    style={styles.accessHistoryCardDetailsTitle}
                                >
                                    Doornfontein
                                </Text>
                                <Text
                                    style={
                                        styles.accessHistoryCardDetailsSubTitle
                                    }
                                >
                                    DFC
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.accessHistoryCard}>
                            <Image
                                source={require("../../assets/icons/history.png")}
                                style={styles.accessHistoryCardIcon}
                            />
                            <View style={styles.accessHistoryCardDetails}>
                                <Text
                                    style={styles.accessHistoryCardDetailsTitle}
                                >
                                    Soweto
                                </Text>
                                <Text
                                    style={
                                        styles.accessHistoryCardDetailsSubTitle
                                    }
                                >
                                    SWC
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.padding,
        backgroundColor: Colors.light.background, // Using the background color from Colors
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
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
    card: {
        marginVertical: Layout.margin,
    },
    sectionTitle: {
        ...Fonts.title, // Using the body font size and weight
        color: Colors.light.text, // Using the text color
        marginBottom: Layout.margin / 2,
    },
    studentCard: {
        borderWidth: Layout.borderWidth, // Using the border width
        borderColor: Colors.light.border, // Using the border color from Colors
        borderRadius: Layout.borderRadius, // Using the border radius constant
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    idText: {
        ...Fonts.body, // Using the body font size and weight
        fontWeight: "bold",
        color: Colors.light.text,
        textAlign: "center",
        paddingVertical: Layout.padding / 2,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: Layout.margin / 2,
        padding: Layout.padding / 2,
    },
    campusServiceItem: {
        width: 75,
        height: 75,
        resizeMode: "contain",
        marginVertical: Layout.margin,
        backgroundColor: Colors.light.border,
        borderRadius: Layout.borderRadius,
        alignItems: "center",
        justifyContent: "center",
    },
    campusServiceItemIcon: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    accessHistory: {
        margin: Layout.margin / 2,
    },
    accessHistoryCard: {
        flexDirection: "column",
        width: 132,
        height: 179,
        backgroundColor: Colors.light.border, // Changed to use the border color from Colors
        borderRadius: Layout.borderRadius,
        padding: Layout.padding / 2,
        marginRight: Layout.margin, // Space between cards in horizontal scroll
        elevation: 3, // Optional shadow for Android
        shadowColor: Colors.light.shadow, // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.2, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow radius for iOS
    },
    accessHistoryCardIcon: {
        width: "80%",
        height: "50%",
        marginBottom: Layout.margin / 2,
        resizeMode: "contain",
    },
    accessHistoryCardDetails: {
        alignItems: "flex-start", // Align text to the left
        width: "100%",
        paddingHorizontal: Layout.padding / 2, // Added padding for better spacing
    },
    accessHistoryCardDetailsTitle: {
        ...Fonts.body, // Using the body font size and weight
        color: Colors.light.text,
        textAlign: "left",
        marginVertical: 4,
        fontWeight: "bold", // Optional for emphasis
    },
    accessHistoryCardDetailsSubTitle: {
        ...Fonts.subtitle, // Using the body font size and weight
        color: Colors.light.text,
        textAlign: "left",
    },
});
