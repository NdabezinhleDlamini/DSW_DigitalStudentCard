import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext"; // Access ThemeContext
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";

export default function AccessHistoryScreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext); // Get currentColors from ThemeContext

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <Text
                        style={[
                            styles.headerText,
                            {
                                fontSize: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                color: currentColors.text,
                                fontFamily: "ThedusWideLight",
                            },
                        ]}
                    >
                        VerifID
                    </Text>
                </View>

                <Text
                    style={[styles.headerText, { color: currentColors.text }]}
                >
                    Current Campus
                </Text>
                <TouchableOpacity
                    style={[
                        styles.syncButton,
                        { backgroundColor: currentColors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.syncButtonText,
                            { color: currentColors.text },
                        ]}
                    >
                        Sync Data
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text
                    style={[styles.sectionTitle, { color: currentColors.text }]}
                >
                    Access History
                </Text>
                <View style={styles.filterSection}>
                    <TouchableOpacity
                        style={[
                            styles.filterChipActive,
                            {
                                backgroundColor: currentColors.background,
                                borderColor: currentColors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterTextActive,
                                { color: currentColors.text },
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterChipInactive,
                            {
                                backgroundColor: currentColors.background,
                                borderColor: currentColors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterTextInactive,
                                { color: currentColors.text },
                            ]}
                        >
                            APB
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterChipInactive,
                            {
                                backgroundColor: currentColors.background,
                                borderColor: currentColors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterTextInactive,
                                { color: currentColors.text },
                            ]}
                        >
                            APK
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterChipInactive,
                            {
                                backgroundColor: currentColors.background,
                                borderColor: currentColors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterTextInactive,
                                { color: currentColors.text },
                            ]}
                        >
                            DFC
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterChipInactive,
                            {
                                backgroundColor: currentColors.background,
                                borderColor: currentColors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterTextInactive,
                                { color: currentColors.text },
                            ]}
                        >
                            SWC
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={styles.historyContainer}>
                        <View style={styles.historyItem}></View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={[
                        styles.viewAllButton,
                        { backgroundColor: currentColors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.viewAllButtonText,
                            { color: currentColors.text },
                        ]}
                    >
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.padding,
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
        ...Fonts.subtitle,
    },
    syncButton: {
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
    },
    section: {
        marginVertical: Layout.margin,
    },
    sectionTitle: {
        ...Fonts.title,
        marginBottom: Layout.margin / 2,
    },
    filterSection: {
        flexDirection: "row",
        width: "100%",
    },
    filterChipActive: {
        width: "15%",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
        borderWidth: 1,
    },
    filterChipInactive: {
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
    },
    filterTextInactive: {
        ...Fonts.body,
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
    },
    historyItemTime: {
        ...Fonts.body,
    },
    viewAllButton: {
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
    },
});
