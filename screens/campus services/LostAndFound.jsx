import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl  } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../Firebase-config";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "../../contexts/ThemeContext";

export default function LostAndFoundScreen({ navigation }) {
  const { currentColors } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start loading
      try {
        // Fetching all lost reports
        const querySnapshot = await getDocs(collection(db, "lost-Reports"));
        const postList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          key: doc.id,
        }));
        setPosts(postList);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "lost-Reports", id));
      setPosts(posts.filter(post => post.key !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.topic, { color: currentColors.text }]}>Lost And Found</Text>
      <TextInput
        style={[styles.search, { borderColor: currentColors.text }]}

        placeholder="Search"
        placeholderTextColor={"grey"}
      />
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: currentColors.settingGroupBackground }]}>
                <View style={[styles.cardHeader]}>
                  <Text style={[styles.title, { color: currentColors.text }]}>{item["Item name"]}</Text>
                  <View style={styles.cardControls}>
                    <TouchableOpacity>
                      <Ionicons name="create-outline" size={24} color={currentColors.text}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteData(item.key)}>
                      <Ionicons name="trash-outline" size={24} color={currentColors.text}/>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.details, { color: currentColors.text }]}>
                  Description: {item["Description"]}
                </Text>
                <Text style={[styles.description, { color: currentColors.text }]}>
                  Location: {item["Location"]}
                </Text>
                <Text style={[styles.details, { color: currentColors.text }]}>
                  Status: {item["Status"]}
                </Text>
                <View>
                  {/* <Image source={{ uri: item.imageURL }} style={styles.image} /> */}
                </View>
              </View>
            )}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PostItemScreen")}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
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
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardControls: {
    width: "25%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "black",
    marginBottom: 10,
    margin: 2,
  },
  details: {
    fontSize: 14,
    color: "black",
    margin: 2,
  },
  image: {
    width: "100%",
    height: 200,
    margin: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
