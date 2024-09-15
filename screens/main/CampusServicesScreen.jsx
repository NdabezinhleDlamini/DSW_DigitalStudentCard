import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";

export default function CampusServicesScreen({navigation}) {
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
            </View>

            {/* Search and Filter Section */}
            <TextInput style={styles.input} placeholder="Search..." />
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterSection}
            >
                <TouchableOpacity style={styles.filterChipActive}>
                    <Text style={styles.filterTextActive}>General</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChipInactive}>
                    <Text style={styles.filterTextInactive}>
                        Card Management
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChipInactive}>
                    <Text style={styles.filterTextInactive}>
                        Support Services
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Main Section */}
            <View style={styles.mainSection}>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: Layout.padding,
        backgroundColor: Colors.light.background, // Using the background color from Colors
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start", // Align to the left
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
    input: {
        height: 40,
        width: "100%",
        marginBottom: Layout.margin / 2,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    filterSection: {
        height: 60,
        flexDirection: "row", // Ensure horizontal layout
        justifyContent: "flex-start", // Align items to the left
        paddingVertical: Layout.padding / 2, // Adjust padding for better alignment
    },
    filterChipActive: {
        flexDirection: "row",
        justifyContent: "center", // Center the content inside the chip
        alignItems: "center",
        marginRight: 10, // Spacing between chips
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
        backgroundColor: Colors.light.tint, // Active chip background color
    },
    filterChipInactive: {
        flexDirection: "row",
        justifyContent: "center", // Center the content inside the chip
        alignItems: "center",
        marginRight: 10, // Spacing between chips
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
        backgroundColor: Colors.light.primary, // Inactive chip background color
    },
    filterTextActive: {
        ...Fonts.body, // Using the body font size and weight
        color: Colors.light.background, // Text color for the active chip
    },
    filterTextInactive: {
        ...Fonts.body, // Using the body font size and weight
        color: Colors.light.text, // Text color for inactive chip
    },
    mainSection: {
        marginTop: Layout.margin,
        backgroundColor: "green",
    },
    newsCard: {
        height: "50%",
        marginVertical: Layout.margin,
        padding: 10,
        backgroundColor: "blue",
        borderRadius: 10,
    },
});
