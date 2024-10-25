import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";

import { db } from "../../Firebase-config";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";

export default function CampusServicesScreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true); // Start loading
            try {
                // Fetching all lost reports
                const querySnapshot = await getDocs(
                    collection(db, "lost-Reports")
                );
                const postList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    key: doc.id,
                }));
                setPosts(postList);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const deleteData = async (id) => {
        try {
            await deleteDoc(doc(db, "lost-Reports", id));
            setPosts(posts.filter((post) => post.key !== id));
        } catch (error) {
            console.error("Error deleting post: ", error);
        }
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    {/* <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Ionicons
                            name="person-circle-outline"
                            size={24}
                            color={currentColors.text} 
                        />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Home Alt")}
                    >
                        <Text
                            style={[
                                styles.headerText,
                                {
                                    color: currentColors.text,
                                    fontFamily: "ThedusWideLight",
                                },
                            ]}
                        >
                            VerifID
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Utils", {
                                    screen: "Notifications",
                                })
                            }
                            style={{ paddingHorizontal: 15 }}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={currentColors.text}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Utils", {
                                    screen: "AppSettings",
                                })
                            }
                            style={{ paddingHorizontal: 5 }}
                        >
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={currentColors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TextInput
                style={[
                    styles.input,
                    { borderColor: currentColors.primaryButtonBackground },
                ]}
                placeholder="Search..."
                placeholderTextColor={currentColors.text}
            />
            <View
                style={[
                    styles.filterContainer,
                    { borderColor: currentColors.primaryButtonBackground },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.filterChipActive,
                        {
                            backgroundColor:
                                currentColors.primaryButtonBackground,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.filterTextActive,
                            { color: currentColors.background },
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterChipInactive,
                        { backgroundColor: currentColors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.filterTextInactive,
                            { color: currentColors.text },
                        ]}
                    >
                        Items
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterChipInactive,
                        { backgroundColor: currentColors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.filterTextInactive,
                            { color: currentColors.text },
                        ]}
                    >
                        Cards
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterChipInactive,
                        { backgroundColor: currentColors.primary },
                    ]}
                >
                    <Text
                        style={[
                            styles.filterTextInactive,
                            { color: currentColors.text },
                        ]}
                    >
                        Clothes
                    </Text>
                </TouchableOpacity>
            </View>

            <View
                style={[
                    styles.mainSection,
                    { backgroundColor: currentColors.card },
                ]}
            >
                <View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <FlatList
                            data={posts}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.card,
                                        {
                                            backgroundColor:
                                                currentColors.settingGroupBackground,
                                        },
                                    ]}
                                >
                                    <View style={[styles.cardHeader]}>
                                        <Text
                                            style={[
                                                styles.title,
                                                { color: currentColors.text },
                                            ]}
                                        >
                                            {item["Item name"]}
                                        </Text>
                                        <View style={styles.cardControls}>
                                            <TouchableOpacity>
                                                <Ionicons
                                                    name="create-outline"
                                                    size={24}
                                                    color={currentColors.text}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    deleteData(item.key)
                                                }
                                            >
                                                <Ionicons
                                                    name="trash-outline"
                                                    size={24}
                                                    color={currentColors.text}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text
                                        style={[
                                            styles.details,
                                            { color: currentColors.text },
                                        ]}
                                    >
                                        Description: {item["Description"]}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.description,
                                            { color: currentColors.text },
                                        ]}
                                    >
                                        Location: {item["Location"]}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.details,
                                            { color: currentColors.text },
                                        ]}
                                    >
                                        Status: {item["Status"]}
                                    </Text>
                                    <View>
                                        {/* <Image source={{ uri: item.imageURL }} style={styles.image} /> */}
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Layout.padding,
        flex: 1,
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    headerText: {
        ...Fonts.subtitle,
        fontSize: 24,
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
    filterContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Layout.margin / 2,
    },
    filterTextActive: {
        ...Fonts.subtitle,
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 10,
        textAlign: "center",
    },
    filterTextInactive: {
        ...Fonts.subtitle,
        fontSize: 16,
        marginRight: 10,
        textAlign: "center",
    },
    filterText: {
        ...Fonts.subtitle,
        fontSize: 16,
        marginRight: 10,
        textAlign: "center",
    },
    filterChipActive: {
        width: "18.75%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: Layout.margin / 2,
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
    },
    filterChipInactive: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
    },
    mainSection: {
        marginTop: Layout.margin / 2,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    cardControls: {
        width: "25%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "black",
        marginBottom: 10,
        margin: 2,
    },
    details: {
        fontSize: 14,
        color: "black",
        margin: 2,
    },
    image: {
        width: "100%",
        height: 200,
        margin: 2,
    },
});
