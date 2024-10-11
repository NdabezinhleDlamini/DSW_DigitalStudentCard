import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useContext } from "react";

import { Colors } from "@/constants/Colors"; // Assuming you have color sets here
import { ThemeContext } from "../../contexts/ThemeContext"; // Assuming your ThemeContext is set up correctly

const initialNotificationsData = [
    { id: "1", type: "like", message: "User123 liked your post.", timestamp: "5 minutes ago" },
    { id: "2", type: "follow", message: "User456 started following you.", timestamp: "10 minutes ago" },
    { id: "3", type: "comment", message: "User789 commented on your post.", timestamp: "15 minutes ago" },
];

export default function Notifications() {
    const [notificationsData, setNotificationsData] = useState(initialNotificationsData);
    const { currentColors } = useContext(ThemeContext); // Access current theme colors

    const clearNotifications = () => {
        setNotificationsData([]); // Clear the notifications
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
            <StatusBar style="auto" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={[styles.title, { color: currentColors.text }]}>Notifications</Text>
                {notificationsData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="notifications-off" size={50} color={currentColors.icon} />
                        <Text style={[styles.emptyText, { color: currentColors.text }]}>No notifications yet!</Text>
                        <Text style={[styles.emptyDescription, { color: currentColors.secondaryText }]}>
                            You will see notifications here when you have any.
                        </Text>
                    </View>
                ) : (
                    notificationsData.map((notification) => (
                        <View key={notification.id} style={styles.notificationItem}>
                            <View style={styles.iconContainer}>
                                {notification.type === "like" && (
                                    <MaterialIcons name="favorite" size={30} color="red" />
                                )}
                                {notification.type === "follow" && (
                                    <MaterialIcons name="person-add" size={30} color={currentColors.icon} />
                                )}
                                {notification.type === "comment" && (
                                    <MaterialIcons name="comment" size={30} color={currentColors.icon} />
                                )}
                                {notification.type === "message" && (
                                    <MaterialIcons name="message" size={30} color={currentColors.icon} />
                                )}
                            </View>
                            <View style={styles.notificationContent}>
                                <Text style={[styles.notificationText, { color: currentColors.text }]}>
                                    {notification.message}
                                </Text>
                                <Text style={[styles.timestampText, { color: currentColors.secondaryText }]}>
                                    {notification.timestamp}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
                {notificationsData.length > 0 && (
                    <TouchableOpacity style={[styles.clearButton, { backgroundColor: currentColors.danger }]} onPress={clearNotifications}>
                        <Text style={styles.clearButtonText}>Clear All Notifications</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
        paddingLeft: 10,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationContent: {
        flex: 1,
        paddingLeft: 10,
    },
    notificationText: {
        fontSize: 16,
    },
    timestampText: {
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },
    emptyDescription: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
    },
    clearButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    clearButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
