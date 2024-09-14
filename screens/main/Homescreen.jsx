import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Layout, Fonts } from "@/constants/Colors";  // Now importing Layout and Fonts

export default function Homescreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity>
                        <Ionicons
                            name="person-circle-outline"
                            size={24}
                            color={Colors.light.tint}  // Using the tint color
                        />
                    </TouchableOpacity>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={Colors.light.tint}  // Using the tint color
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 5 }}>
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={Colors.light.tint}  // Using the tint color
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
                        <Text style={styles.sectionTitle}>Access Control</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.campusServiceItem}>
                        <Image source={require("../../assets/icons/history.png")} style={styles.campusServiceItemIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.campusServiceItem}>
                        <Text style={styles.sectionTitle}>Access Control</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.campusServiceItem}>
                        <Text style={styles.sectionTitle}>Access Control</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Access History Quick Link icons */}
            <View>
                <Text style={styles.sectionTitle}>Access History</Text>
                {/* Access istory Items */}
                <ScrollView>
                    <TouchableOpacity style={styles.accessHistoryCard}>
                        <Image source={require("../../assets/icons/history.png")} style={styles.campusServiceItemIcon}/>
                        <Text style={styles.accessHistoryCardTitle}>Bunting</Text>
                        <Text style={styles.accessHistoryCardSubTitle}>APB</Text>
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
        backgroundColor: Colors.light.background,  // Using the background color from Colors
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",  // Changed to flex-start
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
        ...Fonts.subtitle,  // Using the subtitle font size and weight
        color: Colors.light.text,  // Using the text color
    },
    card: {
        marginVertical: Layout.margin,
    },
    sectionTitle: {
        ...Fonts.body,  // Using the body font size and weight
        color: Colors.light.text,  // Using the text color
        marginBottom: Layout.margin / 2,
    },
    studentCard: {
        borderWidth: Layout.borderWidth,  // Using the border width
        borderColor: Colors.light.border,  // Using the border color from Colors
        borderRadius: Layout.borderRadius,  // Using the border radius constant
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    idText: {
        ...Fonts.body,  // Using the body font size and weight
        fontWeight: "bold",
        color: Colors.light.text,
        textAlign: "center",
        paddingVertical: Layout.padding / 2,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: Layout.margin / 2,
    },
    campusServiceItem: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginBottom: Layout.margin / 2,
        backgroundColor: Colors.light.border,
        borderRadius: Layout.borderRadius,
    },
    campusServiceItemIcon: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    accessHistory: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: Layout.margin / 2,
    },
    accessHistoryCard: {
        flexDirection: "col",
        width: 132,
        height: 179,
        alignItems: "center",
        backgroundColor: "gray",
        borderRadius: Layout.borderRadius,
    },
});
