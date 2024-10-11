import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, TextInput, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState, useEffect } from "react";

import { auth } from '../../Firebase-config';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from '../../Firebase-config'; 

export default function AppSettings({ navigation }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [bannerImg, setBannerImg] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    //get user data
  useEffect(() => {
    const fetchUserData = async () => {
        const userId = auth.currentUser.uid;
        const userDoc = doc(db, "Users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setFirstName(userData.firstName || "N/A"); 
            setLastName(userData.lastName || "N/A"); 
            setEmail(userData.email || "N/A"); 
            setProfilePic(userData.profilePic || null); 
            setBannerImg(userData.bannerImg || null); 
        } else {
            console.log("No such document!");
        }
    };

        fetchUserData();
    }, []);

    // update user info
    const handleSave = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userDoc = doc(db, "Users", userId);
            
            await updateDoc(userDoc, {
                firstName,
                lastName,
                email,
            });

            Alert.alert("Success", "Your information has been updated!");
            setIsEditing(false); 
        } catch (error) {
            Alert.alert("Error", "There was an error updating your information.");
            console.error("Error updating document: ", error);
        }
    };

    // sign out
    const handleSignOut = async () => {
        try {
            await auth.signOut();
            Alert.alert("Signed Out", "You have successfully signed out.");
            navigation.navigate("Login"); // go to login
        } catch (error) {
            Alert.alert("Error", "There was an error signing out.");
            console.error("Error signing out: ", error);
        }
    };

    // remove account
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;

        if (user) {
            // ensure confirmation before deleting
            Alert.alert("Confirm Deletion", "Are you sure you want to delete your account? This cannot be undone.",
                [{ text: "Cancel", style: "cancel" }, {text: "Delete",
                    onPress: async () => {
                        try {
                            const userDoc = doc(db, "Users", user.uid);
                            await deleteDoc(userDoc);

                            await user.delete();
                            Alert.alert("Account Deleted", "Your account has been successfully deleted.");
                            navigation.navigate("Login");
                        } catch (error) {
                            Alert.alert("Error", "There was an error deleting your account.");
                            console.error("Error deleting account: ", error);
                        }
                    }
                 }]
            );
        }
    };

    const pickBannerImage = async () => {
        // TODO: Implement banner image picker
    };

    const pickProfilePicture = async () => {
        // TODO: Implement profile picture picker
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
                    <TouchableOpacity onPress={pickBannerImage}>
                        <Image
                            source={bannerImg ? { uri: bannerImg } : { uri: "https://via.placeholder.com/500x150" }}
                            style={styles.bannerImage}
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
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                placeholder="Display Name"
                            />
                            <Button title="Save" onPress={handleSave} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.infoText}>First Name: {firstName}</Text>
                            <Text style={styles.infoText}>Last Name: {lastName}</Text>
                            <Text style={styles.infoText}>Email: {email}</Text>
                            <Button title="Edit" onPress={() => setIsEditing(true)} />
                        </>
                    )}
                </View>
            </View>

            {/* Theme Settings */}
            {/* <View style={styles.settingGroupContainer}>
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
            </View> */}

            {/* Danger Zone */}
            <View style={styles.dangerZoneContainer}>
                <Text style={styles.label}>Danger Zone</Text>
                <TouchableOpacity style={styles.dangerOption} onPress={handleSignOut}>
                    <Text style={styles.dangerText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerOption} onPress={handleDeleteAccount}>
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
        justifyContent: "center",
    },
    settingGroupContainer: {
        width: "90%",
        backgroundColor: Colors.light.tint,
        padding: 20,
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "center",
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
        padding: 20,
        borderRadius: 10,
        marginTop: 'auto',
        marginBottom: 30,
    },
    dangerOption: {
        paddingVertical: 10,
    },
    dangerText: {
        color: Colors.light.text,
        fontWeight: "bold",
    },
    userInfo: {
        alignItems: "center",
        justifyContent: "center",
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    bannerImage: {
        width: "100%",
        height: 150,
        marginBottom: 20,
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
});