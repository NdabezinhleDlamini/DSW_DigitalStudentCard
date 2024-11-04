import React, { useEffect, useState, useContext, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    ImageBackground,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNfc } from "../../components/nfc";

import { Layout } from "../../constants/Layout";
import { Fonts } from "../../constants/Fonts";

import { auth, db } from "../../Firebase-config";
import { doc, getDoc } from "firebase/firestore";

import { useRouter } from "expo-router";

const lightBackground = require("../../assets/images/Onbaording_Light.png");
const darkBackground = require("../../assets/images/Onboarding_Dark.png");

export default function HomescreenAlt({ navigation }) {
    const { currentColors, isDarkMode } = useContext(ThemeContext);
    const router = useRouter();

    const [userLoginData, setUserLoginData] = useState(null);

    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState({
        name: "",
        description: "",
        temperature: "",
    });

    const {
        isNfcSupported,
        isScanning,
        readTag,
        writeToTag,
        cleanUp,
        decodeMessage,
        invalidateSession,
    } = useNfc();

    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(1)).current;

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
        if (userLoginData && userLoginData.uid) {
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

    const animateIn = () => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 0.9,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateOut = () => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

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

    useEffect(() => {
        // Example: check if NFC is supported when the component mounts
        if (isNfcSupported === false || isNfcSupported === null) {
            Alert.alert("NFC is not supported on this device");
        } else {
            Alert.alert("NFC is supported");
        }
    }, [isNfcSupported]);

    const handleWriteNfcTag = async (data) => {
        try {
            const serializedData = JSON.stringify(data);
            await writeToTag({
                dataToWrite: serializedData,
                writeMessageForOS: "Writing data to NFC",
            });
            invalidateSession();
            cleanUp();
        } catch (e) {
            invalidateSession(true, JSON.stringify(e));
            cleanUp();
            Alert.alert("Error writing to NFC", JSON.stringify(e));
        }
    };

    return (
        <ImageBackground
            source={isDarkMode ? darkBackground : lightBackground}
            style={styles.backgroundImage}
        >
            <SafeAreaView style={[styles.container]}>
                <StatusBar
                    style={isDarkMode ? "light" : "dark"}
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    translucent={true}
                    backgroundColor={currentColors.background}
                />
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
                                        shadowOffset: { width: 0, height: 10 },
                                        shadowColor: "rgba(128, 128, 128, 0.3)",
                                        shadowOpacity: 0.9,
                                        shadowRadius: 5,
                                        elevation: 6,
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
                                        screen: "Quiz",
                                    })
                                }
                            >
                                <Ionicons
                                    name="game-controller-outline"
                                    size={24}
                                    color={currentColors.text}
                                />
                            </TouchableOpacity>
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

                    <TouchableOpacity style={styles.Cardbutton} onPress={() => {
                            handleWriteNfcTag();
                        }}>
                            <Image
                                        style={styles.studentCard}
                                        source={
                                            userLoginData?.profilePic
                                                ? { uri: userLoginData.profilePic }
                                                : { uri: "https://via.placeholder.com/100" } 
                                        }
                    />
                    <View>
                        <Text style={styles.cardInfor}>
                            {userLoginData ? userLoginData.firstName : "First Name..."}
                        </Text>
                        <Text style={styles.cardInfor}>
                            {userLoginData ? userLoginData.lastName : "Last Name..."}
                        </Text>
                        </View>
                    </TouchableOpacity>
                    <Text
                        style={[styles.idText, { color: currentColors.text }]}
                    >
                        {/* Fetch user student number from fire base */}
                        {userLoginData
                            ? `${userLoginData.studentNumber}`
                            : "Student Number..."}
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

                        <Animated.View
                            style={[
                                styles.button,
                                {
                                    transform: [{ scale: scaleValue }],
                                    opacity: opacityValue,
                                },
                            ]}
                        >
                            <View style={styles.iconRow}>
                                <TouchableOpacity
                                    onPressIn={animateIn}
                                    onPressOut={animateOut}
                                    style={[
                                        styles.campusServiceItem,
                                        {
                                            backgroundColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("PostItemScreen")
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Lost
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPressIn={animateIn}
                                    onPressOut={animateOut}
                                    style={[
                                        styles.campusServiceItem,
                                        {
                                            backgroundColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("AccessHistory")
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Access History
                                    </Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    onPressIn={animateIn}
                                    onPressOut={animateOut}
                                    style={[
                                        styles.campusServiceItem,
                                        {
                                            backgroundColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("CardCollection")
                                    }
                                    // change the name as the stack only
                                > 
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Collect
                                    </Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity
                                    onPressIn={animateIn}
                                    onPressOut={animateOut}
                                    style={[
                                        styles.campusServiceItem,
                                        {
                                            backgroundColor:
                                                currentColors.primaryButtonBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("RequestNewCard")
                                    }
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Request
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.padding,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
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
        width: 120,
        height: 120,
        resizeMode: "cover",
        borderRadius: 99,
    },
    Cardbutton:{
        width: "100%",
        height:175,
        backgroundColor: 'white',
        padding: 20,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection:'row',
    },
    cardInfor:{
        marginBottom: 20,
        marginLeft:'33%',
        fontSize: 20,
        fontWeight: "bold",
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
        width: 90,
        height: 75,
        borderRadius: Layout.borderRadius,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 10 },
        shadowColor: "rgba(128, 128, 128, 0.3)",
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 6,
    },
});
