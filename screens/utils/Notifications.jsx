import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useContext, useEffect } from "react";

import { ThemeContext } from "../../contexts/ThemeContext";

export default function Notifications() {
    const [notificationsData, setNotificationsData] = useState([]);
    const { currentColors } = useContext(ThemeContext);

    const clearNotifications = () => {
        setNotificationsData([]);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            let notifications = await getNotificationInbox(
                24451,
                "9MBVb21BgXTmYIiNxD53bg"
            );
            console.log("notifications: ", notifications);
            setNotificationsData(notifications); // Update with the fetched notifications
        };

        fetchNotifications();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <Text style={[styles.notificationText, { color: currentColors.text }]}>
                    {item.message}
                </Text>
                <Text style={[styles.timestampText, { color: currentColors.secondaryText }]}>
                    {item.timestamp}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={[styles.title, { color: currentColors.text }]}>Notifications</Text>
                {notificationsData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="notifications-off" size={50} color={currentColors.text} />
                        <Text style={[styles.emptyText, { color: currentColors.text }]}>No notifications yet!</Text>
                        <Text style={[styles.emptyDescription, { color: currentColors.text }]}>
                            You will see notifications here when you have any.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={notificationsData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
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
