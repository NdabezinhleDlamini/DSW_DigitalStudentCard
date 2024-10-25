import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Modal, StyleSheet, Text, View, TouchableOpacity, Image, Button, TextInput, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import { ThemeContext } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";

export default function AppSettings({ navigation }) {
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [displayName, setDisplayName] = useState("johndoe123");
    const [profilePic, setProfilePic] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);  // Modal visibility state

    const {logout} = useContext(AuthContext);

    const { isDarkMode, toggleTheme, currentColors, setTheme } = useContext(ThemeContext);

    const pickProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    const handleSignOut = () => {
        logout();
        setIsModalVisible(false);  // Close the modal
        console.log("User signed out");  // Here you would add actual sign out logic
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
            <StatusBar style="auto" />

            {/* User Information Section */}
            <View style={[styles.settingGroupContainer, { backgroundColor: currentColors.settingGroupBackground }]}>
                <Text style={[styles.label, { color: currentColors.text }]}>User Information</Text>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={pickProfilePicture}>
                        <Image
                            source={profilePic ? { uri: profilePic } : { uri: "https://via.placeholder.com/500x150" }}
                            style={styles.profilePicture}
                        />
                    </TouchableOpacity>

                    {isEditing ? (
                        <>
                            <TextInput
                                style={[styles.input, { backgroundColor: currentColors.background, color: currentColors.text }]}
                                placeholderTextColor={currentColors.text}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: currentColors.background, color: currentColors.text }]}
                                placeholderTextColor={currentColors.text}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: currentColors.background, color: currentColors.text }]}
                                placeholderTextColor={currentColors.text}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Display Name"
                            />
                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: currentColors.primaryButtonBackground }]}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.infoText, { color: currentColors.text }]}>First Name: {firstName}</Text>
                            <Text style={[styles.infoText, { color: currentColors.text }]}>Last Name: {lastName}</Text>
                            <Text style={[styles.infoText, { color: currentColors.text }]}>Display Name: {displayName}</Text>
                            <TouchableOpacity
                                style={[styles.editButton, { backgroundColor: currentColors.primaryButtonBackground }]}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Theme Settings */}
            <View style={[styles.settingGroupContainer, { backgroundColor: currentColors.settingGroupBackground }]}>
                <Text style={[styles.label, { color: currentColors.text }]}>Theme</Text>

                <Switch
                    trackColor={{ false: "#81b0ff", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? currentColors.primaryButtonBackground : Colors.light.primaryButtonBackground}
                    onValueChange={toggleTheme}
                    value={isDarkMode}
                />
            </View>

            {/* Danger Zone */}
            <View style={[styles.dangerZoneContainer, { backgroundColor: currentColors.dangerZoneBackground }]}>
                <Text style={[styles.label, { color: currentColors.text }]}>Danger Zone</Text>
                <TouchableOpacity
                    style={styles.dangerOption}
                    onPress={() => setIsModalVisible(true)}  // Show the modal when the user clicks sign out
                >
                    <Text style={styles.dangerText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerOption} onPress={() => console.log("Delete Account")}>
                    <Text style={styles.dangerText}>Delete Account</Text>
                </TouchableOpacity>
            </View>

            {/* Sign Out Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}  // Close modal when user presses back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to sign out?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: currentColors.primaryButtonBackground }]}
                                onPress={handleSignOut}
                            >
                                <Text onPress={handleSignOut} style={styles.modalButtonText}>Sign Out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: currentColors.dangerZoneBackground }]}
                                onPress={() => setIsModalVisible(false)}  // Close the modal if user cancels
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 20,
    },
    settingGroupContainer: {
        width: "90%",
        padding: 20,
        borderRadius: 10,
        flexDirection: "column",
        marginVertical: 10,
    },
    settingTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    themeSettings: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 10,
    },
    settingText: {
        marginLeft: 10,
        fontSize: 20,
    },
    dangerZoneContainer: {
        width: "90%",
        borderWidth: 1.5,
        borderColor: "red",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 30,
    },
    dangerOption: {
        paddingVertical: 10,
    },
    dangerText: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
    },
    userInfo: {
        justifyContent: "center",
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    editButton: {
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    dangerZoneContainer: {
        width: "90%",
        borderWidth: 1.5,
        borderColor: "red",
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 30,
    },
    dangerOption: {
        paddingVertical: 10,
    },
    dangerText: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
