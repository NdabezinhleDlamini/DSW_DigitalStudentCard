import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have this package installed for icons
import { useNavigation } from '@react-navigation/native'; // Import navigation

const campuses = [
  {
    label: 'University of Johannesburg APK',
    value: 'uj_apk',
    location: '\nC/of Kingsway and University Road\nAuckland Park\nLibrary Bridge Cellar\nGround floor',
    // image: require("../../assets/images/UJ_APK.jpg"), // Update the path to your image
  },
  {
    label: 'University of Johannesburg APB',
    value: 'uj_apb',
    location: '\n15 Bunting Road\nCottesloe\nProtection Services Building\n1st Floor\nOffice 102',
    // image: require("../../assets/images/UJ_APB.jpg"), // Update the path to your image
  },
  {
    label: 'University of Johannesburg DFC',
    value: 'uj_dfc',
    location: '\n37 Nind Street\nDoornfontein',
    // image: require("../../assets/images/UJ_DFC.jpg"), // Update the path to your image
  },
  {
    label: 'University of Johannesburg SWC',
    value: 'uj_swc',
    location: '\nChris Hani Road\nSoweto\nAdministration Building Block D (uKhamba)\nGround floor\nOffice ADD 1192028\nGround floor\nOffice G01',
    // image: require("../../assets/images/UJ_SWC.jpg"), // Update the path to your image
  },
];

const CardCollectionScreen = () => {
  const [selectedCampus, setSelectedCampus] = useState(''); // State for selected campus
  const [selectedLocation, setSelectedLocation] = useState(''); // State for selected campus location
  const [selectedImage, setSelectedImage] = useState(null); // State for selected campus image
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const navigation = useNavigation(); // Hook for navigation

  const handleSelectCampus = (campus) => {
    setSelectedCampus(campus.label);
    setSelectedLocation(campus.location);
    setSelectedImage(campus.image);
    setModalVisible(false); // Close the modal after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Your Campus:</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={selectedCampus ? styles.selectedText : styles.placeholderText}>
          {selectedCampus || 'Enter your campus'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={campuses}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelectCampus(item)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                  {/* <Image source={item.image} style={styles.image} resizeMode="contain" /> */}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selectedCampus ? (
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={24} color="red" />
          <Text style={styles.selectedCampusText}>
            {selectedCampus} - {selectedLocation}
          </Text>
          {selectedImage && (
            <Image source={selectedImage} style={styles.image} resizeMode="contain" />
          )}
        </View>
      ) : (
        <Text style={styles.selectedCampusText}>Please select a campus</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  placeholderText: {
    color: '#aaa',
  },
  selectedText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
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
    backgroundColor: '#3b5998',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  selectedCampusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3b5998',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CardCollectionScreen;
