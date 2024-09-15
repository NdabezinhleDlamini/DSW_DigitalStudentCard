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

export default function AccessHistoryScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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
                <TouchableOpacity style={styles.syncButton}>
                    <Text style={styles.syncButtonText}>Sync Data</Text>
                </TouchableOpacity>
            </View>
            {/* Access History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Access History</Text>
                {/* Filters */}
                <View style={styles.filterSection}>
                    <TouchableOpacity style={styles.filterChipActive}>
                        <Text style={styles.filterTextActive}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChipInactive}>
                        <Text style={styles.filterTextInactive}>APB</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChipInactive}>
                        <Text style={styles.filterTextInactive}>APK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChipInactive}>
                        <Text style={styles.filterTextInactive}>DFC</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChipInactive}>
                        <Text style={styles.filterTextInactive}>SWC</Text>
                    </TouchableOpacity>
                </View>

                {/* Fecth and map History from Firebase */}
                <ScrollView>
                    <View style={styles.historyContainer}>
                        <View style={styles.historyItem}>
                            <View style={styles.historyItemDetails}>
                                <Text style={styles.historyItemTime}>
                                    Today 09:30
                                </Text>
                                <Text style={styles.historyItemName}>
                                    Campus Entrance
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/* View All button */}
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
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
    syncButton: {
        backgroundColor: Colors.light.primary,
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderWidth: 1,
    },
    syncButtonText: {
        ...Fonts.body,
        color: Colors.light.text,
    },
    section: {
        marginVertical: Layout.margin,
    },
    sectionTitle: {
        ...Fonts.title, // Using the body font size and weight
        color: Colors.light.text, // Using the text color
        marginBottom: Layout.margin / 2,
    },
    filterSection: {
        height: "fit-content",
        flexDirection: "row", // Ensure horizontal layout
        width: "100%",
    },
    filterChipActive: {
        backgroundColor: Colors.dark.background,
        width: "15%",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
        borderWidth: 1,
    },
    filterChipInactive: {
        backgroundColor: Colors.light.background,
        padding: 10,
        width: "20%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
        borderWidth: 1,
    },
    filterTextActive: {
        ...Fonts.body,
        color: Colors.dark.text,
    },
    filterTextInactive: {
        ...Fonts.body,
        color: Colors.light.text,
    },
    historyContainer: {
        marginTop: 30,
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    historyItemDetails: {
        flexDirection: "column",
        marginLeft: 0,
    },
    historyItemName: {
        ...Fonts.body,
        fontWeight: "bold",
        color: Colors.light.text,
    },
    historyItemTime: {
        ...Fonts.body,
        color: Colors.light.text,
    },
    viewAllButton: {
        backgroundColor: Colors.light.primary,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        borderWidth: 1,
        marginTop: Layout.margin,
    },
    viewAllButtonText: {
        ...Fonts.body,
        color: Colors.light.text,
    },
});
