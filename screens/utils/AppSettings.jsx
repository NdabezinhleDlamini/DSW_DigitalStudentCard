import { StatusBar } from "expo-status-bar";
import {
    SafeAreaView,
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Button,
    TextInput,
    Switch,
    Alert,
    ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState, useContext, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { ThemeContext } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";

import { auth } from "../../Firebase-config";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../Firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNfc } from "../../components/nfc";

export default function AppSettings({ navigation }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCardEditing, setIsCardEditing] = useState(false);

    const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
        useState(false);
    const { logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme, currentColors, setTheme } =
        useContext(ThemeContext);

    const {
        isNfcSupported,
        isScanning,
        readTag,
        writeToTag,
        cleanUp,
        decodeMessage,
        invalidateSession,
    } = useNfc();

    // _______________________________________________________________

    const [userLoginData, setUserLoginData] = useState(null);

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

    // _______________________________________________________________
    //get user data

    const pickProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log("Image picker result:", result);

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
            console.log("Image picked:", result.assets.uri);
        }
    };

    //function to upload profile pic
    const uploadImage = async () => {
        if (!profilePic) {
            Alert.alert(
                "No Image Selected",
                "Please select an image before uploading."
            );
            return null;
        }
        try {
            const imageRef = ref(
                storage,
                `UserProfilePictures/${auth.currentUser.uid}`
            );

            const response = await fetch(profilePic);
            if (!response.ok) {
                throw new Error("Failed to fetch image.");
            }

            const blob = await response.blob();
            if (!blob) {
                throw new Error("Failed to create a blob from the response.");
            }

            await uploadBytes(imageRef, blob);
            try {
                const url = await getDownloadURL(imageRef);
                return url;
            } catch (error) {
                console.error("Error getting download URL:", error.message);
                throw error;
            }
        } catch (error) {
            console.error("Image upload error:", error);
            console.log("Image URL:", profilePic);
            // console.error("Response Status:", response.status);
            return null;
        }
    };

    // update user info
    const handleSave = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userDoc = doc(db, "Users", userId);

            // If a new profile picture upload
            let profilePicUrl = profilePic;
            if (profilePic) {
                profilePicUrl = await uploadImage(profilePic);
            }

            await updateDoc(userDoc, {
                firstName,
                lastName,
                email,
                profilePic: profilePicUrl,
            });

            Alert.alert("Updated", "Your information has been updated!");
            setIsEditing(false);
        } catch (error) {
            Alert.alert(
                "Error",
                "There was an error updating your information."
            );
            console.error("Error updating document: ", error);
        }
    };

    const handleReadNfcTag = async () => {
        try {
            console.log(`reading from nfc function`);
            const tag = await readTag({
                writeMessageForOS: "Ready to read NFC",
            });
            console.log(`tag --> ${tag}`);

            if (tag && tag.ndefMessage) {
                const firstMessage = tag.ndefMessage[0].payload;
                const nfcContent = decodeMessage(firstMessage);
                const parsedData = JSON.parse(nfcContent);
                console.log("Data from NFC:", parsedData);
            }
            invalidateSession();
            cleanUp();
        } catch (e) {
            invalidateSession(true, JSON.stringify(e));
            cleanUp();
            Alert.alert(`Error reading from NFC ${JSON.stringify(e)}`);
        }
    };

    const showCard = () => {
        setIsEditing(true);
    };

    const handleSignOut = () => {
        logout();
        setIsSignOutModalVisible(false); // Close the modal
        console.log("User signed out"); // Here you would add actual sign out logic
    };

    // remove account
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;

        if (user) {
            // confirmation before deleting
            Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete your account? This cannot be undone.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        onPress: async () => {
                            try {
                                const userDoc = doc(db, "Users", user.uid);
                                await deleteDoc(userDoc);

                                await user.delete();
                                Alert.alert(
                                    "Account Deleted",
                                    "Your account has been successfully deleted."
                                );
                                navigation.navigate("Login");
                            } catch (error) {
                                Alert.alert(
                                    "Error",
                                    "There was an error deleting your account."
                                );
                                console.error(
                                    "Error deleting account: ",
                                    error
                                );
                            }
                        },
                    },
                ]
            );
        }
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >

            {/* User Information Section */}
            <View
                style={[
                    styles.settingGroupContainer,
                    { backgroundColor: currentColors.settingGroupBackground },
                ]}
            >
                <Text style={[styles.label, { color: currentColors.text }]}>
                    User Information
                </Text>
                <View style={styles.userInfo}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity onPress={pickProfilePicture}>
                                <Image
                                    source={
                                        profilePic
                                            ? { uri: profilePic }
                                            : {
                                                uri: "https://via.placeholder.com/500x150",
                                            }
                                    }
                                    style={styles.profilePicture}
                                />
                            </TouchableOpacity>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor:
                                            currentColors.background,
                                        color: currentColors.text,
                                    },
                                ]}
                                placeholderTextColor="#777777"
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder={userLoginData?.firstName}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor:
                                            currentColors.background,
                                        color: currentColors.text,
                                    },
                                ]}
                                placeholderTextColor="#777777"
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder={userLoginData?.lastName}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor:
                                            currentColors.background,
                                        color: currentColors.text,
                                    },
                                ]}
                                placeholderTextColor="#777777"
                                value={email}
                                onChangeText={setEmail}
                                placeholder={userLoginData?.email}
                            />

                            <TouchableOpacity
                                style={[styles.addCardButton, { borderWidth: 1, borderColor: currentColors.primaryButtonBackground }]}
                                onPress={() => {
                                    setIsCardEditing(true);
                                }}
                            >
                                <MaterialIcons
                                    name="add-card"
                                    size={24}
                                    color={currentColors.text}
                                />
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: currentColors.text },
                                    ]}
                                >
                                    Add My Card
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    {
                                        backgroundColor:
                                            currentColors.primaryButtonBackground,
                                    },
                                ]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.editButton,
                                    { borderWidth: 1, borderColor: "red" },
                                ]}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: currentColors.text },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View>
                                <Image
                                    source={
                                        userLoginData?.profilePic
                                            ? { uri: userLoginData.profilePic }
                                            : {
                                                  uri: "https://via.placeholder.com/100",
                                              }
                                    }
                                    style={styles.profilePicture}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: currentColors.text },
                                ]}
                            >
                                First Name: {userLoginData?.firstName}
                            </Text>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: currentColors.text },
                                ]}
                            >
                                Last Name: {userLoginData?.lastName}
                            </Text>
                            <Text
                                style={[
                                    styles.infoText,
                                    { color: currentColors.text },
                                ]}
                            >
                                Email: {userLoginData?.email}
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.editButton,
                                    {
                                        backgroundColor:
                                            currentColors.primaryButtonBackground,
                                    },
                                ]}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            {/* Theme Settings */}

            <View
                style={[
                    styles.settingGroupContainer,
                    { backgroundColor: currentColors.settingGroupBackground },
                ]}
            >
                <Text style={[styles.label, { color: currentColors.text }]}>
                    Theme
                </Text>
                <View style={styles.switchContainer}>
                    <Text
                        style={[
                            styles.switchText,
                            { color: currentColors.text },
                        ]}
                    >
                        {!isDarkMode ? "Dark" : "Light"} Mode
                    </Text>
                    <Switch
                        trackColor={{ false: "#81b0ff", true: "#81b0ff" }}
                        thumbColor={
                            isDarkMode
                                ? currentColors.primaryButtonBackground
                                : Colors.light.primaryButtonBackground
                        }
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View
                style={[
                    styles.dangerZoneContainer,
                    { backgroundColor: currentColors.dangerZoneBackground },
                ]}
            >
                <Text style={[styles.label, { color: currentColors.text }]}>
                    Danger Zone
                </Text>
                <TouchableOpacity
                    style={styles.dangerOption}
                    onPress={() => setIsSignOutModalVisible(true)} // Show the modal when the user clicks sign out
                >
                    <Text style={styles.dangerText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.dangerOption}
                    onPress={() => setIsDeleteAccountModalVisible(true)}
                >
                    <Text style={styles.dangerText}>Delete Account</Text>
                </TouchableOpacity>
            </View>

            {/* Edit Card Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCardEditing}
                onRequestClose={() => setIsCardEditing(false)} // Close modal when user presses back button
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor:
                                    currentColors.settingGroupBackground,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.scanButton,
                                {
                                    backgroundColor:
                                        currentColors.primaryButtonBackground,
                                },
                            ]}
                            onPress={handleReadNfcTag}
                        >
                            <Text style={styles.buttonText}>
                                {isScanning ? "Scanning..." : "Read Card"}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.cardDetails}></View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsCardEditing(false)}
                        >
                            <Text style={{ color: currentColors.text }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Sign Out Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isSignOutModalVisible}
                onRequestClose={() => setIsSignOutModalVisible(false)} // Close modal when user presses back button
            >
                <View style={[styles.modalOverlay]}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor:
                                    currentColors.settingGroupBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.modalTitleText,
                                { color: currentColors.text },
                            ]}
                        >
                            Sign out?
                        </Text>
                        <View style={styles.modalDescription}>
                            <Text
                                style={[
                                    styles.modalDescriptionText,
                                    { color: currentColors.text },
                                ]}
                            >
                                This will end your current session.
                            </Text>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor: "red",
                                    },
                                ]}
                                onPress={handleSignOut}
                            >
                                <Text
                                    onPress={handleSignOut}
                                    style={styles.modalButtonText}
                                >
                                    Sign Out
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        borderWidth: 1,
                                        borderColor:
                                            currentColors.primaryButtonBackground,
                                    },
                                ]}
                                onPress={() => setIsSignOutModalVisible(false)}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        { color: currentColors.text },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete account Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDeleteAccountModalVisible}
                onRequestClose={() => setIsDeleteAccountModalVisible(false)} // Close modal when user presses back button
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor:
                                    currentColors.settingGroupBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.modalTitleText,
                                { color: currentColors.text },
                            ]}
                        >
                            Delete account?
                        </Text>
                        <View style={styles.modalDescription}>
                            <Text
                                style={[
                                    styles.modalDescriptionText,
                                    { color: currentColors.text },
                                ]}
                            >
                                This action can't be undone
                            </Text>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor: "red",
                                    },
                                ]}
                                onPress={handleDeleteAccount}
                            >
                                <Text
                                    onPress={handleDeleteAccount}
                                    style={styles.modalButtonText}
                                >
                                    Delete Account
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {
                                        borderWidth: 1,
                                        borderColor:
                                            currentColors.primaryButtonBackground,
                                    },
                                ]}
                                onPress={() =>
                                    setIsDeleteAccountModalVisible(false)
                                }
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        { color: currentColors.text },
                                    ]}
                                >
                                    Cancel
                                </Text>
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
    addCardButton: {
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    saveButton: {
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
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 10,
    },
    switchText: {
        marginLeft: 10,
        fontSize: 18,
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
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalTitleText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    modalDescription: {
        marginBottom: 20,
    },
    modalDescriptionText: {
        fontSize: 16,
        textAlign: "center",
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
    scanButton: {
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
    closeButton: {
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
    },
});
