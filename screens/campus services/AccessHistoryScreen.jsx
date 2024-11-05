import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "../../Firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AccessHistoryScreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext);
    const [userLoginData, setUserLoginData] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);

    useEffect(() => {
        const getUserLoginData = async () => {
            try {
                const data = await AsyncStorage.getItem("auth");
                if (data) {
                    setUserLoginData(JSON.parse(data));
                }
            } catch (error) {
                console.error("Error getting user login data:", error);
            }
        };
        getUserLoginData();
    }, []);

    useEffect(() => {
        if (userLoginData?.uid) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "Users", userLoginData.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserLoginData((prevData) => ({
                            ...prevData,
                            ...docSnap.data(),
                        }));
                    } else {
                        console.log("User data not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [userLoginData?.uid]);

    useEffect(() => {
        if (!userLoginData?.studentNumber) return;

        const logsQuery = query(
            collection(db, "ActivityLogs"),
            where("studentNumber", "==", userLoginData.studentNumber)
        );

        const unsubscribe = onSnapshot(logsQuery, (querySnapshot) => {
            const logs = [];
            querySnapshot.forEach((doc) => {
                logs.push({ id: doc.id, ...doc.data() });
            });
            setActivityLogs(logs);
        });

        return () => unsubscribe();
    }, [userLoginData?.studentNumber]);

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View style={[styles.header,{ marginRight: 10, flexDirection: "row", alignItems: "center", }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, ]}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={currentColors.text}
                    />
                </TouchableOpacity>
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
            <View style={styles.section}>
                <Text
                    style={[styles.sectionTitle, { color: currentColors.text }]}
                >
                    Access History
                </Text>
                <ScrollView>
                    <View>
                        {activityLogs.map((log) => (
                            <View key={log.id} style={[styles.historyItem, { backgroundColor: currentColors.settingGroupBackground, color: currentColors.text }]}>
                                <Text style={[styles.historyItemAction, { color: currentColors.text, fontWeight: "bold" }]}>
                                    Action: {log.action}
                                </Text>
                                <Text style={[styles.historyItemDetails, { color: currentColors.text }]}>
                                    Details: {log.details}
                                </Text>
                                <Text style={[styles.historyItemResult, { color: currentColors.text }]}>
                                    Result: {log.result}
                                </Text>
                                <Text style={[styles.historyItemTimestamp, { color: "#888" }]}>
                                    Timestamp:
                                    {log.timestamp.toDate().toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </View>
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
    historyItem: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    historyItemAction: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    historyItemDetails: {
        fontSize: 14,
        marginBottom: 4,
    },
    historyItemResult: {
        fontSize: 14,
        fontStyle: "italic",
        marginBottom: 4,
    },
    historyItemTimestamp: {
        fontSize: 12,
        marginTop: 6,
    },
});
