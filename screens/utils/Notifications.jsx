import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState, useContext, useEffect } from "react";
import { getNotificationInbox } from "native-notify";

import { ThemeContext } from "../../contexts/ThemeContext";

export default function Notifications({ navigation }) {
    const [notificationsData, setNotificationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentColors } = useContext(ThemeContext);

    const clearNotifications = () => {
        setNotificationsData([]);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            let notifications = await getNotificationInbox(
                24451,
                "9MBVb21BgXTmYIiNxD53bg"
            );
            console.log("notifications: ", notifications);
            if (notifications) {
                setNotificationsData(notifications);
            }
            setLoading(false);
        };

        fetchNotifications();
    }, []);

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
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View style={styles.scrollContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            color={currentColors.text}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: currentColors.text }]}>
                        Notifications
                    </Text>
                </View>
                {loading ? ( // Show ActivityIndicator when loading
                    <ActivityIndicator
                        size="large"
                        color={currentColors.text}
                    />
                ) : notificationsData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons
                            name="notifications-off"
                            size={50}
                            color={currentColors.text}
                        />
                        <Text
                            style={[
                                styles.emptyText,
                                { color: currentColors.text },
                            ]}
                        >
                            No notifications yet!
                        </Text>
                        <Text
                            style={[
                                styles.emptyDescription,
                                { color: currentColors.text },
                            ]}
                        >
                            You will see notifications here when you have any.
                        </Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={notificationsData}
                            renderItem={renderItem}
                            keyExtractor={(item) =>
                                item.id
                                    ? item.id.toString()
                                    : Math.random().toString()
                            }
                        />
                        {/* <TouchableOpacity
                            style={[
                                styles.clearButton,
                                { backgroundColor: currentColors.danger },
                            ]}
                            onPress={clearNotifications}
                        >
                            <Text style={styles.clearButtonText}>
                                Clear All Notifications
                            </Text>
                        </TouchableOpacity> */}
                    </>
                )}
                {notificationsData.length > 0 && (
                    <TouchableOpacity
                        style={[
                            styles.clearButton,
                            { backgroundColor: currentColors.danger },
                        ]}
                        onPress={clearNotifications}
                    >
                        <Text style={styles.clearButtonText}>
                            Clear All Notifications
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 10,
        marginBottom: 100,
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
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd", // Light border for separation
        backgroundColor: "#fff", // Background color for each notification
        borderRadius: 8, // Rounded corners
        marginVertical: 5, // Space between notifications
        shadowColor: "#000", // Shadow for elevation
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    iconContainer: {
        marginRight: 10, // Space between icon and text
    },
    notificationContent: {
        flex: 1,
        justifyContent: "center",
    },
    usernameText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationText: {
        fontSize: 14,
        marginVertical: 2, // Space between notification text and timestamp
    },
    timestampText: {
        fontSize: 12,
        color: "#888", // Color for timestamp
    },
});
