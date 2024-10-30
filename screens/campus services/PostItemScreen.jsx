import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, storage, auth } from "../../Firebase-config";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { registerIndieID, unregisterIndieDevice } from "native-notify";
import axios from "axios";

import { ThemeContext } from "@/contexts/ThemeContext";

const lightBackground = require("../../assets/images/Onbaording_Light.png");
const darkBackground = require("../../assets/images/Onboarding_Dark.png");

export default function PostItemScreen({ navigation }) {
    registerIndieID(`${auth.currentUser.uid}`, 24451, "9MBVb21BgXTmYIiNxD53bg");

    const { currentColors, isDarkMode } = useContext(ThemeContext);
    const [userLoginData, setUserLoginData] = useState(null);
    const [itemName, setItemName] = useState("");
    const [image, setImage] = useState(null); // For holding the image locally
    const [imageURL, setImageURL] = useState(""); // For storing the uploaded image URL
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [itemType, setItemType] = useState("");
    const [otherItemType, setOtherItemType] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [studentNumber, setStudentNumber] = useState(null);
    const [loading, setLoading] = useState(false);

    const itemTypes = ["Card", "Clothing", "Other"];

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

    const handleImagePicker = async () => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert("Permission to access media library is required!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            // Check if selection was not canceled and assets are available
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset && asset.uri) {
                    setImage(asset);
                    setImageURL(asset.uri);
                    console.log("Image picked:", asset.uri);
                } else {
                    console.error("Asset does not contain a URI.");
                    Alert.alert(
                        "Error",
                        "No valid image URI found. Please try again."
                    );
                }
            } else {
                console.log("Image selection was canceled or no assets found.");
                Alert.alert(
                    "No Image Selected",
                    "Please pick an image to upload."
                );
            }
        } catch (error) {
            console.error("Error selecting image:", error);
            Alert.alert(
                "Error",
                "An error occurred while selecting an image. Please try again."
            );
        }
    };

    //uuid was a problem so manually generating a uid was the way to go
    const generateUUID = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const uploadImage = async () => {
        if (!imageURL) {
            Alert.alert("No Image Selected", "Please select an image.");
            return null;
        }

        try {
            const response = await fetch(imageURL);

            if (!response.ok) {
                console.error("Failed to fetch image:", response.status);
                throw new Error("Failed to fetch image from URI.");
            }

            const blob = await response.blob();
            if (!blob) {
                console.error("Failed to create blob from response.");
                throw new Error("Failed to create blob from response.");
            }

            const imageRef = ref(storage, `LostItems/${generateUUID()}`);
            await uploadBytes(imageRef, blob);

            const url = await getDownloadURL(imageRef);
            console.log("Image uploaded successfully:", url);
            return url;
        } catch (error) {
            console.error("Image upload error:", error);
            Alert.alert("Image Upload Failed", "Please try again.");
            return null;
        }
    };

    // get user data
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser.uid;
            const userDoc = doc(db, "Users", userId);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setStudentNumber(userData.studentNumber);
            } else {
                console.log("No such document!");
            }
        };

        fetchUserData();
    }, []);

    const handlePost = async () => {
        if (!itemName || !date || !location || !description || !itemType) {
            Alert.alert("Please fill in all fields");
            return;
        }

        setLoading(true);

        const finalItemType = itemType === "Other" ? otherItemType : itemType;

        try {
            const uploadedImageURL = await uploadImage();
            if (!uploadedImageURL) return;

            const newPost = {
                itemName,
                imageURL: uploadedImageURL,
                date,
                location,
                description,
                status,
                studentNumber:
                    userLoginData?.studentNumber ||
                    "Unable to set student number", // Ensure no undefined value
                itemType: finalItemType,
            };

            const postCollection = collection(db, "lost-Reports");
            await addDoc(postCollection, newPost);
            Alert.alert("Post added");
            notify();
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "There was a problem creating the post.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectItemType = (type) => {
        setItemType(type);
        setModalVisible(false);
    };

    const notify = (bigPictureURL) => {
        axios
            .post(`https://app.nativenotify.com/api/notification`, {
                appId: 24451,
                appToken: "9MBVb21BgXTmYIiNxD53bg",
                title: "BOLO: Lost Item",
                body: "Lost " + itemName + " Reported",
                dateSent: new Date().toLocaleString("en-US", {
                    timeZone: "UTC",
                }),
                pushData: { itemName, location, date },
                bigPictureURL: bigPictureURL,
            })
            .then((response) => {
                console.log(
                    "Push notification sent successfully:",
                    response.data
                );
            })
            .catch((error) => {
                console.error("Error sending push notification:", error);
            });
    };

    return (
        <ImageBackground
            source={isDarkMode ? darkBackground : lightBackground}
            style={styles.backgroundImage}
        >
            <SafeAreaView style={styles.container}>
                <View>
                    <View style={styles.topBar}>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={30}
                                    color={currentColors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.titleContainer}>
                            <Text
                                style={[
                                    styles.topic,
                                    { color: currentColors.text },
                                ]}
                            >
                                Report Lost Item
                            </Text>
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <TextInput
                                style={[
                                    styles.search,
                                    { color: currentColors.text },
                                ]}
                                placeholder="Item Name:"
                                placeholderTextColor={"grey"}
                                value={itemName}
                                onChangeText={(text) => setItemName(text)}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleImagePicker}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        {
                                            color: currentColors.primaryButtonText,
                                        },
                                    ]}
                                >
                                    {image ? "Image Selected" : "Pick an Image"}
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                style={[
                                    styles.search,
                                    { color: currentColors.text },
                                ]}
                                placeholder="Date:"
                                placeholderTextColor={"grey"}
                                value={date}
                                onChangeText={(text) => setDate(text)}
                            />

                            <TextInput
                                style={[
                                    styles.search,
                                    { color: currentColors.text },
                                ]}
                                placeholder="Location:"
                                placeholderTextColor={"grey"}
                                value={location}
                                onChangeText={(text) => setLocation(text)}
                            />

                            <TextInput
                                style={[
                                    styles.search,
                                    { color: currentColors.text },
                                ]}
                                placeholder="Description:"
                                placeholderTextColor={"grey"}
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.buttonText}>
                                    {itemType
                                        ? `Type: ${itemType}`
                                        : "Select Item Type"}
                                </Text>
                            </TouchableOpacity>

                            {itemType === "Other" && (
                                <TextInput
                                    style={[
                                        styles.search,
                                        { color: currentColors.text },
                                    ]}
                                    placeholder="Specify Other Type:"
                                    placeholderTextColor={"grey"}
                                    value={otherItemType}
                                    onChangeText={(text) =>
                                        setOtherItemType(text)
                                    }
                                />
                            )}

                            <TextInput
                                style={[
                                    styles.search,
                                    { color: currentColors.text },
                                ]}
                                placeholder="Status:"
                                placeholderTextColor={"grey"}
                                value={status}
                                onChangeText={(text) => setStatus(text)}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handlePost}
                            >
                                <Text style={styles.buttonText}>Post</Text>
                            </TouchableOpacity>

                            {/* Modal for Item Type selection */}
                            <Modal
                                visible={modalVisible}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <FlatList
                                            data={itemTypes}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={styles.option}
                                                    onPress={() =>
                                                        handleSelectItemType(
                                                            item
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.optionText
                                                        }
                                                    >
                                                        {item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() =>
                                                setModalVisible(false)
                                            }
                                        >
                                            <Text
                                                style={styles.closeButtonText}
                                            >
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )}
                </View>

                <StatusBar style={isDarkMode ? "dark" : "light"} translucent />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    backButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
    },
    topic: {
        fontSize: 28,
        fontWeight: "bold",
        justifyContent: "center",
        alignItems: "center",
    },
    search: {
        borderWidth: 1,
        borderColor: "#555",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
    },
    option: {
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
    },
    optionText: {
        fontSize: 18,
        color: "#333",
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#1e90ff",
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
