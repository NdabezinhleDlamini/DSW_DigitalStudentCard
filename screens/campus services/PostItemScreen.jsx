import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../Firebase-config";
import { collection, addDoc } from "firebase/firestore";

export default function PostItemScreen({ navigation }) {
  const [itemName, setItemName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handlePost = async () => {
    if (itemName !== imageURL){
      Alert.alert("Fill in all fields");
      return;
    }
    try{
      const newPost = {
          itemName,
          imageURL,
          date,
          location,
          description,
          status,
    };
    const postCollection = collection(db, "lost-Reports");
        await addDoc(postCollection, newPost);
        alert("Post added");
    }catch (error) {
        console.log(error);
  };
}

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.topic}>Add Lost Item</Text>

        <TextInput
          style={styles.search}
          placeholder="Item Name:"
          placeholderTextColor={"grey"}
          value={itemName}
          onChangeText={(text) => setItemName(text)}
        />
        
        <TextInput
          style={styles.search}
          placeholder="Image:"
          placeholderTextColor={"grey"}
          value={imageURL}
          onChangeText={(text) => setImageURL(text)}
        />
        
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    padding: 7,
    margin: 10,
  },
  topic: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  button: {
    backgroundColor: "#1e90ff", // Button background color (blue)
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 25, // Horizontal padding
    borderRadius: 25, // Rounded corners
    alignItems: "center", // Center the text
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
