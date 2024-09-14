import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileScreen(){
    return (
        <View style={styles.container}>
            <View style={styles.statusBar}>
                <Text style={styles.time}>9:30</Text>
                {/* Add status icons here */}
            </View>
            <Text style={styles.header}>Student Home</Text>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: "path_to_house_icon" }}
                    style={styles.profileIcon}
                />
                <Text style={styles.idNumber}>****4401</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button}>
                        <Text>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text>More</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.viewMore}>View More</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>John M Doe</Text>
                <Text style={styles.address}>Gloria Stakem's Entrance</Text>
            </View>
            <View style={styles.accessHistory}>
                <Text style={styles.historyHeader}>Access History</Text>
                {/* Map access history items here */}
                <View style={styles.historyItem}>
                    <Text>APR</Text>
                    <Text>10:17</Text>
                    <Text>In</Text>
                </View>
                <View style={styles.historyItem}>
                    <Text>Gloria Sekwena Entrance</Text>
                    <Text>16:57</Text>
                    <Text>Out</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    time: {
        fontSize: 18,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
    },
    profileContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    idNumber: {
        fontSize: 18,
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 10,
    },
    button: {
        padding: 10,
        backgroundColor: "#ddd",
        borderRadius: 5,
    },
    viewMore: {
        color: "blue",
        marginTop: 10,
    },
    detailsContainer: {
        marginVertical: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    address: {
        fontSize: 16,
        color: "#555",
    },
    accessHistory: {
        marginVertical: 20,
    },
    historyHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
});
