import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";


import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

export default function OnBoardingScreen({ navigation }) {
    
    const [fontsLoaded] = useFonts({
        ThedusWideLight: require("../assets/fonts/ThedusWideLight-Bold.otf"),
    });

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    const {auth, login, logout} = useContext(AuthContext);

    return (
      <>
        <StatusBar
          style="dark"
          translucent={true}
          backgroundColor="rgba(0,0,0,0)"
        />
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../assets/images/Onboarding_Dark.png")}
        >
          <View>
            <Image
              style={styles.logo}
              source={require("../assets/images/Logo_White.png")}
            />
            <Text style={styles.title}>Verifid</Text>
            <Text style={styles.subtitle}>Tap Into Convenience</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { borderColor: "#1e90ff" }]}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <View style={styles.hasAccount}>
            <Text
              style={{
                marginRight: 4,
                color: Colors.dark.text,
                fontWeight: "bold",
              }}
            >
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "#1e90ff",
                  fontWeight: "bold",
                }}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    logo: {
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
    subtitle: {
        marginVertical: 5,
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
    },
    button: {
        backgroundColor: "transparent",
        height: 50,
        width: "75%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        alignSelf: "center",
        borderWidth: 1.5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    hasAccount: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
});
