import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    FlatList,
    Button
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { db } from "../../Firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function Admin({ navigation }) {
    const [data, setData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    
    const fetchUserData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Users"));
            const formattedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(formattedData); 
            setFilteredData(formattedData); 
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

   
    useEffect(() => {
        fetchUserData();
    }, []);

    
    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text === "") {
            setFilteredData(data); 
        } else {
            const filtered = data.filter((item) =>
                item.studentNumber?.toLowerCase().includes(text.toLowerCase()) ||
                item.LastLoginTime?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Student No: {item.studentNumber}</Text>
            <Text style={styles.itemText}>Date: {item.LastLoginTime}</Text>
        </View>
    );

    return (
        <>
            <StatusBar style="dark" translucent={true} backgroundColor="rgba(0,0,0,0)" />
            <ImageBackground
                style={styles.backgroundImage}
                source={require("../../assets/images/Onboarding_Dark.png")}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Admin</Text>
                    <TextInput
                        placeholder="Search student No/date..."
                        style={styles.search}
                        value={searchTerm}
                        onChangeText={handleSearch}
                    />
                    {/* <Button title="search" onPress={fetchUserData} /> */}
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                </View>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    search: {
        width: "80%",
        height: 40,
        backgroundColor: "white",
        paddingHorizontal: 10,
        marginVertical: 20,
        borderRadius: 5,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    title: {
        fontFamily: "ThedusWideLight",
        fontSize: 30,
        color: "#fff",
        textAlign: "center",
    },
    itemContainer: {
        backgroundColor: "white",
        padding: 15,
        marginVertical: 10,
        width: "100%",
        borderRadius: 5,
    },
    itemText: {
        width:'100%',
        fontSize: 16,
        color: "black",
    },
});