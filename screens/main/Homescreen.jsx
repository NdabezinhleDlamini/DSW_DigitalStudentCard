import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext

import { Colors } from "../../constants/Colors";
import { Layout } from "../../constants/Layout";
import { Fonts } from "../../constants/Fonts";

export default function Homescreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext);
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Ionicons
                            name="person-circle-outline"
                            size={24}
                            color={currentColors.tint} // Use theme color for tint
                        />
                    </TouchableOpacity>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={currentColors.tint} // Use theme color for tint
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 5 }}>
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={currentColors.tint} // Use theme color for tint
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Current Campus */}
                <Text style={[styles.headerText, { color: currentColors.text }]}>
                    Current Campus
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                    My ID
                </Text>
                <TouchableOpacity>
                    <Image
                        source={{ uri: "https://placehold.co/600x400/png" }}
                        style={[
                            styles.studentCard,
                            { borderColor: currentColors.border },
                        ]}
                    />
                </TouchableOpacity>
                <Text style={[styles.idText, { color: currentColors.text }]}>
                    219110401
                </Text>
            </View>
            {/* Campus Services Quick Link icons */}
            <View>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                    Campus Services
                </Text>
                <View style={styles.iconRow}>
                    <TouchableOpacity style={[styles.campusServiceItem, { backgroundColor: currentColors.border }]}>
                        <Text>Access Control</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.campusServiceItem, { backgroundColor: currentColors.border }]}>
                        <Text>Access Control</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.campusServiceItem, { backgroundColor: currentColors.border }]}>
                        <Text>Access Control</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.campusServiceItem, { backgroundColor: currentColors.border }]}>
                        <Text>Access Control</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Access History */}
            <View>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                    Access History
                </Text>
                <ScrollView horizontal={true}>
                    <TouchableOpacity style={[styles.accessHistoryCard, { backgroundColor: currentColors.border }]}>
                        <Image
                            source={require("../../assets/icons/history.png")}
                            style={styles.accessHistoryCardIcon}
                        />
                        <View style={styles.accessHistoryCardDetails}>
                            <Text style={[styles.accessHistoryCardDetailsTitle, { color: currentColors.text }]}>
                                Bunting
                            </Text>
                            <Text style={[styles.accessHistoryCardDetailsSubTitle, { color: currentColors.text }]}>
                                APB
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.accessHistoryCard, { backgroundColor: currentColors.border }]}>
                        <Image
                            source={require("../../assets/icons/history.png")}
                            style={styles.accessHistoryCardIcon}
                        />
                        <View style={styles.accessHistoryCardDetails}>
                            <Text style={[styles.accessHistoryCardDetailsTitle, { color: currentColors.text }]}>
                                Kingsway
                            </Text>
                            <Text style={[styles.accessHistoryCardDetailsSubTitle, { color: currentColors.text }]}>
                                APK
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.accessHistoryCard, { backgroundColor: currentColors.border }]}>
                        <Image
                            source={require("../../assets/icons/history.png")}
                            style={styles.accessHistoryCardIcon}
                        />
                        <View style={styles.accessHistoryCardDetails}>
                            <Text style={[styles.accessHistoryCardDetailsTitle, { color: currentColors.text }]}>
                                Doorfontein
                            </Text>
                            <Text style={[styles.accessHistoryCardDetailsSubTitle, { color: currentColors.text }]}>
                                DFC
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.accessHistoryCard, { backgroundColor: currentColors.border }]}>
                        <Image
                            source={require("../../assets/icons/history.png")}
                            style={styles.accessHistoryCardIcon}
                        />
                        <View style={styles.accessHistoryCardDetails}>
                            <Text style={[styles.accessHistoryCardDetailsTitle, { color: currentColors.text }]}>
                                Soweto
                            </Text>
                            <Text style={[styles.accessHistoryCardDetailsSubTitle, { color: currentColors.text }]}>
                                SWC
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Add more Access History items */}
                </ScrollView>
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
    card: {
        marginVertical: Layout.margin,
    },
    sectionTitle: {
        ...Fonts.title,
        marginBottom: Layout.margin / 2,
    },
    studentCard: {
        borderWidth: Layout.borderWidth,
        borderRadius: Layout.borderRadius,
        width: "100%",
        height: 200,
        resizeMode: "cover",
    },
    idText: {
        ...Fonts.body,
        fontWeight: "bold",
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
        borderRadius: Layout.borderRadius,
        alignItems: "center",
        justifyContent: "center",
    },
    accessHistoryCard: {
        flexDirection: "column",
        width: 132,
        height: 179,
        borderRadius: Layout.borderRadius,
        padding: Layout.padding / 2,
        marginRight: Layout.margin,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    accessHistoryCardIcon: {
        width: "80%",
        height: "50%",
        marginBottom: Layout.margin / 2,
        resizeMode: "contain",
    },
    accessHistoryCardDetails: {
        alignItems: "flex-start",
        width: "100%",
        paddingHorizontal: Layout.padding / 2,
    },
    accessHistoryCardDetailsTitle: {
        ...Fonts.body,
        textAlign: "left",
        marginVertical: 4,
        fontWeight: "bold",
    },
    accessHistoryCardDetailsSubTitle: {
        ...Fonts.subtitle,
        textAlign: "left",
    },
});
