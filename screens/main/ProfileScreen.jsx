import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeContext } from "../../contexts/ThemeContext"; // Import ThemeContext

import {Colors} from '../../constants/Colors';
import {Layout} from '../../constants/Layout';
import {Fonts} from '../../constants/Fonts';

export default function UserProfileScreen({ navigation }) {
  const { isDarkMode, toggleTheme, currentColors } = useContext(ThemeContext); // Get theme state from context

  const [fontsLoaded] = useFonts({
    ThedusWideLight: require("../../assets/fonts/ThedusWideLight-Bold.otf"),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.header}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={[styles.headerText, { color: currentColors.text, fontFamily: "ThedusWideLight" }]}>
              VerifID
            </Text>
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={{ paddingHorizontal: 15 }}>
              <Ionicons name="notifications-outline" size={24} color={currentColors.tint} />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingHorizontal: 5 }}>
              <Ionicons name="settings-outline" size={24} color={currentColors.tint} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header Section */}
        <View style={styles.headerSection}>
          <Image
            style={styles.headerImage}
            source={{ uri: "https://via.placeholder.com/500x150" }} // Placeholder for header background
          />
          <View style={[styles.profileImageWrapper, { borderColor: currentColors.tint }]}>
            <Image
              style={styles.profileImage}
              source={{ uri: "https://via.placeholder.com/100" }} // Placeholder for Profile Picture
            />
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.nameText, { color: currentColors.text }]}>John Doe</Text>
          <Text style={[styles.idText, { color: "#777" }]}>@johndoe</Text>
        </View>

        {/* Switch for Dark Mode */}
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: currentColors.text }]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? currentColors.tint : Colors.light.tint}
            onValueChange={toggleTheme} // Use the toggleTheme from context
            value={isDarkMode}
          />
        </View>

        {/* Report Lost Card Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.reportButton, { backgroundColor: currentColors.tint }]}
            onPress={() => navigation.navigate("ReportLostCard")}
          >
            <Text style={[styles.buttonText, { color: currentColors.text }]}>Report Lost Card</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Timeline */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Recent Activities</Text>
          <View style={[styles.activityItem, { backgroundColor: isDarkMode ? "#1d3557" : "#edf6f9" }]}>
            <Text style={[styles.activityText, { color: currentColors.text }]}>
              Accessed the Library
            </Text>
            <Text style={[styles.timestamp, { color: "#777" }]}>2 hours ago</Text>
          </View>
          {/* Add more activities here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    headerSection: {
        width: "100%",
        position: "relative",
    },
    headerImage: {
        width: "100%",
        height: 150,
    },
    profileImageWrapper: {
        position: "absolute",
        bottom: -50,
        left: 20,
        borderWidth: 3,
        borderRadius: 50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    infoSection: {
        marginTop: 60,
        paddingHorizontal: 20,
    },
    nameText: {
        fontSize: 22,
        fontWeight: "bold",
    },
    idText: {
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    switchLabel: {
        fontSize: 18,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    reportButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    activitySection: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    activityItem: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    activityText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: "#777",
        marginTop: 4,
    },
});
