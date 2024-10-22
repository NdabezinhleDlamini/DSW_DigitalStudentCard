import React, { useEffect, useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Colors } from "../../constants/Colors";
import { Layout } from "../../constants/Layout";
import { Fonts } from "../../constants/Fonts";

import { useRouter } from "expo-router";

export default function HomescreenAlt({ navigation }) {
    const { currentColors } = useContext(ThemeContext);
    const router = useRouter();

    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState({
        name: "",
        description: "",
        temperature: "",
    });

    // Get device location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation({
                lat: loc.coords.latitude,
                lon: loc.coords.longitude,
            });
        })();
    }, []);

    // Fetch weather based on location
    useEffect(() => {
        if (location) {
            const getWeather = async () => {
                const api = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=94c521c713a0d7283174a262c651ba61`;
                try {
                    let response = await fetch(api);
                    let data = await response.json();

                    if (data.weather && data.weather.length > 0) {
                        const { main, description } = data.weather[0];
                        const { temp } = data.main;
                        const { name } = data;

                        setWeather({
                            name: main,
                            description: description,
                            temperature: Math.round(temp),
                            locationName: name,
                        });
                    } else {
                        alert("No weather data found");
                    }
                } catch (error) {
                    alert("Error fetching weather data");
                }
            };

            getWeather();
        }
    }, [location]);

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
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
                            style={{ paddingHorizontal: 15 }}
                            onPress={() =>
                                navigation.navigate("Utils", {
                                    screen: "Notifications",
                                })
                            }
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={currentColors.text}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 5 }}
                            onPress={() =>
                                navigation.navigate("Utils", {
                                    screen: "AppSettings",
                                })
                            }
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

            <View style={styles.card}>
                <View
                    style={[
                        styles.weatherWidget,
                        {
                            backgroundColor:
                                currentColors.primaryButtonBackground,
                        },
                    ]}
                >
                    <View style={styles.weatherWidgetDetails}>
                        <Text
                            style={[
                                styles.weatherWidgetTitleText,
                                { color: "currentColors.text" },
                            ]}
                        >
                            {weather.locationName
                                ? weather.locationName
                                : "Loading..."}
                        </Text>
                        <Text
                            style={[
                                styles.weatherWidgetSubtitleText,
                                { color: currentColors.text },
                            ]}
                        >
                            {weather.name}
                        </Text>
                        <Text
                            style={[
                                styles.weatherWidgetText,
                                { color: currentColors.text },
                            ]}
                        >
                            {weather.description}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.weatherWidgetTempText,
                            { color: currentColors.text },
                        ]}
                    >
                        {weather.temperature
                            ? `${weather.temperature}°C`
                            : "..."}
                    </Text>
                </View>

                <TouchableOpacity>
                    <Image
                        source={{ uri: "https://placehold.co/600x400/png" }}
                        style={[
                            styles.studentCard,
                            {
                                borderColor:
                                    currentColors.primaryButtonBackground,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text style={[styles.idText, { color: currentColors.text }]}>
                    219110401
                </Text>
            </View>

            <View>
                {/* Campus Services Quick Link icons */}
                <View>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: currentColors.text },
                        ]}
                    >
                        Campus Services
                    </Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity
                            style={[
                                styles.campusServiceItem,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() =>
                                navigation.navigate("Services", {
                                    screen: "PostItemScreen",
                                })
                            }
                        >
                            <Text>Lost</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.campusServiceItem,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() =>
                                navigation.navigate("Services", {
                                    screen: "AccessHistory",
                                })
                            }
                        >
                            <Text>Access Control</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.campusServiceItem,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() =>
                                navigation.navigate("Services", {
                                    screen: "CardCollection",
                                })
                            }
                        >
                            <Text>Collect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.campusServiceItem,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() =>
                                navigation.navigate("Services", {
                                    screen: "RequestNewCard",
                                })
                            }
                        >
                            <Text>Request</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        paddingHorizontal: Layout.padding,
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
        fontSize: 24,
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
    weatherWidget: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: Layout.padding,
        borderRadius: Layout.borderRadius,
        marginBottom: Layout.margin,
    },
    weatherWidgetDetails: {
        flexDirection: "column",
        marginLeft: Layout.margin,
    },
    weatherWidgetTitleText: {
        ...Fonts.body,
        fontWeight: "bold",
        fontSize: 20,
        color: "white",
    },
    weatherWidgetSubtitleText: {
        ...Fonts.body,
        color: "white",
    },
    weatherWidgetTempText: {
        ...Fonts.body,
        fontWeight: "bold",
        fontSize: 40,
        color: "white",
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
});
