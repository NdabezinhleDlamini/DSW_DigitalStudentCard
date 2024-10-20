import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../Firebase-config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {useState, useEffect} from "react";
import { Ionicons } from "@expo/vector-icons";

export default function LostAndFoundScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

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
                setLoading(false); // Stop loading
            }
        };

        fetchPosts();

        // Optional cleanup if needed
        return () => {
            setPosts([]); // Clear posts on unmount (if necessary)
        };
    }, []);

  console.log(posts);


  return (
    <SafeAreaView>
      <View>
        <Text style={styles.topic}>Lost And Found</Text>
        <TextInput
          style={styles.search}
          placeholder="Search"
          placeholderTextColor={"grey"}
        />

        <View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
            
                  <Text style={styles.title}>{item["Item name"]}</Text>

                  <View style={styles.cardControls}>
                    <TouchableOpacity>
                      <Ionicons name="create-outline" size="24" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteData(item.key)}>
                      <Ionicons name="trash-outline" size="24" />
                    </TouchableOpacity>
                  </View>

                </View>
                <Text style={styles.details}>
                  Description: {item["Description"]}
                </Text>
                <Text style={styles.description}>
                  Location:
                  {item["Location"]}
                </Text>
                <Text style={styles.details}>
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

        <TouchableOpacity style={styles.button}onPress={() => navigation.navigate("PostItemScreen")}>
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
