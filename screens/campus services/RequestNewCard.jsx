import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { db } from '../../Firebase-config'; 
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { useNavigation } from '@react-navigation/native';

import { ThemeContext } from "@/contexts/ThemeContext";

export default function RequestNewCard() {

  const {currentColors} = useContext(ThemeContext);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [student, setStudent] = useState('');

  
  const validateStudentNumber = (input) => /^[0-9]*$/.test(input);

  const handleSubmit = async () => {
  
    if (!name || !surname || !student) {
      Alert.alert("Incomplete Form", "Please fill in all fields.");
      return;
    }

    
    if (!validateStudentNumber(student)) {
      Alert.alert("Invalid Student Number", "Student number must contain digits only.");
      return;
    }

    try {
    
      const auth = getAuth();
      const user = auth.currentUser;

     
      await addDoc(collection(db, 'cardRequests'), {
       
        Name: name,
        Surname: surname,
        Student_No: student,
      });

      Alert.alert("Request Submitted", `Name: ${name}\nSurname: ${surname}`);
     // navigation.navigate('Homescreen');
      
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save the data.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>Request For Student Card</Text>

      <TextInput 
        style={[styles.input, { borderColor: currentColors.primaryButtonBackground, backgroundColor: currentColors.background }]} 
        placeholder="Name:" 
        placeholderTextColor={currentColors.text}
        value={name} 
        onChangeText={setName} 
      />

      <TextInput 
        style={[styles.input, { borderColor: currentColors.primaryButtonBackground, backgroundColor: currentColors.background }]} 
        placeholder="Surname:"
        placeholderTextColor={currentColors.text} 
        value={surname} 
        onChangeText={setSurname} 
      />

      <TextInput 
        style={[styles.input, { borderColor: currentColors.primaryButtonBackground, backgroundColor: currentColors.background }]} 
        placeholder="Student number:" 
        placeholderTextColor={currentColors.text}
        keyboardType="numeric" 
        value={student} 
        onChangeText={setStudent} 
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.primaryButtonBackground }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { color: currentColors.primaryButtonText }]}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E1EBEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 8,
    width: '80%',
    marginBottom: 80,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 50,
    width: 150,
    height: 50,
    backgroundColor: '#007791',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

