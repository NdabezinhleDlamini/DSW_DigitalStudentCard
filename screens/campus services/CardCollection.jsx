import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ThemeContext } from "../../contexts/ThemeContext";

const campuses = [
    {
        label: "University of Johannesburg APK",
        value: "uj_apk",
        location:
            "\nC/of Kingsway and University Road\nAuckland Park\nLibrary Bridge Cellar\nGround floor",
    },
    {
        label: "University of Johannesburg APB",
        value: "uj_apb",
        location:
            "\n15 Bunting Road\nCottesloe\nProtection Services Building\n1st Floor\nOffice 102",
    },
    {
        label: "University of Johannesburg DFC",
        value: "uj_dfc",
        location: "\n37 Nind Street\nDoornfontein",
    },
    {
        label: "University of Johannesburg SWC",
        value: "uj_swc",
        location:
            "\nChris Hani Road\nSoweto\nAdministration Building Block D (uKhamba)\nGround floor\nOffice ADD 1192028\nGround floor\nOffice G01",
    },
];

export default function CardCollectionScreen() {
    const { currentColors } = useContext(ThemeContext);
    const [selectedCampus, setSelectedCampus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleSelectCampus = (campus) => {
        setSelectedCampus(campus.label);
        setSelectedLocation(campus.location);
        setModalVisible(false);
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <Text style={[styles.label, { color: currentColors.text }]}>
                Select Your Campus:
            </Text>
            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        borderColor: currentColors.primaryButtonBackground,
                        backgroundColor: currentColors.background,
                    },
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    style={
                        selectedCampus
                            ? [
                                  styles.selectedText,
                                  { color: currentColors.text },
                              ]
                            : [
                                  styles.placeholderText,
                                  { color: currentColors.text },
                              ]
                    }
                >
                    {selectedCampus || "Select your campus"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={[
                        styles.modalContainer,
                        { backgroundColor: currentColors.modalBackground },
                    ]}
                >
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: currentColors.cardBackground },
                        ]}
                    >
                        <FlatList
                            style={styles.modalList}
                            data={campuses}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleSelectCampus(item)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            { color: currentColors.text },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text
                                style={[
                                    styles.closeButtonText,
                                    { color: currentColors.text },
                                ]}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {selectedCampus ? (
                <View style={styles.locationContainer}>
                    <MaterialIcons
                        name="location-on"
                        size={24}
                        color={currentColors.primaryButtonBackground}
                    />
                    <Text
                        style={[
                            styles.selectedCampusText,
                            { color: currentColors.text },
                        ]}
                    >
                        {selectedCampus} - {selectedLocation}
                    </Text>
                </View>
            ) : (
                <Text
                    style={[
                        styles.selectedCampusText,
                        { color: currentColors.placeholder },
                    ]}
                >
                    Please select a campus
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.backButton,
                    { backgroundColor: currentColors.primaryButtonBackground },
                ]}
                onPress={() => navigation.goBack()}
            >
                <Text
                    style={[
                        styles.backButtonText,
                        { color: currentColors.buttonText },
                    ]}
                >
                    Back to Home
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    placeholderText: {
        color: "#aaa",
    },
    selectedText: {
        color: "#333",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    option: {
        padding: 15,
    },
    optionText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: {
        fontWeight: "bold",
    },
    locationContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 20,
    },
    selectedCampusText: {
        marginTop: 10,
        fontSize: 16,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    backButtonText: {
        fontWeight: "bold",
    },
});
