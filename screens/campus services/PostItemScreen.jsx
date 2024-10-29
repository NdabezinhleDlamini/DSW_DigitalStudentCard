import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    FlatList,
    Image,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, storage, auth } from "../../Firebase-config";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";

import { ThemeContext } from "@/contexts/ThemeContext";

export default function PostItemScreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext);

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

    const itemTypes = ["Card", "Clothing", "Other"];

    const handleImagePicker = async () => {
      try {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
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
                  Alert.alert("Error", "No valid image URI found. Please try again.");
              }
          } else {
              console.log("Image selection was canceled or no assets found.");
              Alert.alert("No Image Selected", "Please pick an image to upload.");
          }
      } catch (error) {
          console.error("Error selecting image:", error);
          Alert.alert("Error", "An error occurred while selecting an image. Please try again.");
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
                studentNumber: studentNumber,
                itemType: finalItemType,
            };

            const postCollection = collection(db, "lost-Reports");
            await addDoc(postCollection, newPost);
            Alert.alert("Post added");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "There was a problem creating the post.");
            console.log(error);
        }
    };

    const handleSelectItemType = (type) => {
        setItemType(type);
        setModalVisible(false);
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <View>
                <Text style={[styles.topic, { color: currentColors.text }]}>
                    Add Lost Item
                </Text>

                <TextInput
                    style={[styles.search, { color: currentColors.text }]}
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
                            { color: currentColors.primaryButtonText },
                        ]}
                    >
                        {image ? "Image Selected" : "Pick an Image"}
                    </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.search}
                    placeholder="Date:"
                    placeholderTextColor={"grey"}
                    value={date}
                    onChangeText={(text) => setDate(text)}
                />

                <TextInput
                    style={styles.search}
                    placeholder="Location:"
                    placeholderTextColor={"grey"}
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />

                <TextInput
                    style={styles.search}
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
                        {itemType ? `Type: ${itemType}` : "Select Item Type"}
                    </Text>
                </TouchableOpacity>

                {itemType === "Other" && (
                    <TextInput
                        style={styles.search}
                        placeholder="Specify Other Type:"
                        placeholderTextColor={"grey"}
                        value={otherItemType}
                        onChangeText={(text) => setOtherItemType(text)}
                    />
                )}

                <TextInput
                    style={styles.search}
                    placeholder="Status:"
                    placeholderTextColor={"grey"}
                    value={status}
                    onChangeText={(text) => setStatus(text)}
                />

                <TouchableOpacity style={styles.button} onPress={handlePost}>
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
                                            handleSelectItemType(item)
                                        }
                                    >
                                        <Text style={styles.optionText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    search: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 7,
        margin: 10,
        width: "95%",
    },
    topic: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
    },
    button: {
        backgroundColor: "#1e90ff",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        backgroundColor: "#1e90ff",
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: {
        fontWeight: "bold",
        color: "white",
    },
});
