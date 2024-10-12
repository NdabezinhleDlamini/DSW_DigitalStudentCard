import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function AppSettings({ navigation }) {
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [displayName, setDisplayName] = useState("johndoe123");
    const [profilePic, setProfilePic] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    const pickProfilePicture = async () => {
        // TODO: Implement profile picture picker with expo image picker

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            {/* User Information Section */}
            <View style={styles.settingGroupContainer}>
                <Text style={styles.label}>User Information</Text>
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
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                            />
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                            />
                            <TextInput
                                style={styles.input}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Display Name"
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.infoText}>First Name: {firstName}</Text>
                            <Text style={styles.infoText}>Last Name: {lastName}</Text>
                            <Text style={styles.infoText}>Display Name: {displayName}</Text>
                            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Theme Settings */}
            <View style={styles.settingGroupContainer}>
                <Text style={styles.label}>Theme</Text>
                <View style={styles.themeSettings}>
                    <View style={styles.settingTitleContainer}>
                        <MaterialIcons name="brightness-medium" size={24} color="black" />
                        <Text style={styles.settingText}>Automatic</Text>
                    </View>
                </View>
                <View style={styles.themeSettings}>
                    <View style={styles.settingTitleContainer}>
                        <MaterialIcons name="light-mode" size={24} color="black" />
                        <Text style={styles.settingText}>Light</Text>
                    </View>
                </View>
                <View style={styles.themeSettings}>
                    <View style={styles.settingTitleContainer}>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                        <Text style={styles.settingText}>Dark</Text>
                    </View>
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.dangerZoneContainer}>
                <Text style={styles.label}>Danger Zone</Text>
                <TouchableOpacity style={styles.dangerOption} onPress={() => console.log('Sign Out')}>
                    <Text style={styles.dangerText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerOption} onPress={() => console.log('Delete Account')}>
                    <Text style={styles.dangerText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: Colors.light.tint,
        padding: 20,
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "flex-start",
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
        backgroundColor: Colors.light.background,
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
        backgroundColor: '#f9f9f9', // Light background for inputs
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
        backgroundColor: Colors.light.tint,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
