import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Logo from "../assets/images/Logo_White.png";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

export default function SplashScreen() {
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });
    if (!fontsLoaded) {
        return null; // or a loading spinner
    }
    return (
        <>
            <StatusBar
                style="dark"
                translucent={true}
                backgroundColor="rgba(0,0,0,0)"
            />

            <View style={styles.container}>
                <Image source={Logo} style={styles.image} />
                <Text style={styles.title}>Verifid</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: "center",
        resizeMode: "contain",
    },
    title: {
        fontFamily: "ThedusWideLight",
        fontSize: 70,
        color: "#fff",
        textAlign: "center",
        marginTop: 50,
    },
});
