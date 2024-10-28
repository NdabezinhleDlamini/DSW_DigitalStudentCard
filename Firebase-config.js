// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKKRJpcb-Z8iCeXB_imZ7odikuKgXzX4M",
  authDomain: "verifid-d076a.firebaseapp.com",
  projectId: "verifid-d076a",
  storageBucket: "verifid-d076a.appspot.com",
  messagingSenderId: "356732996691",
  appId: "1:356732996691:web:9b659b266337aabcfb4aa6",
  measurementId: "G-ET4PLN3NQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with a check to avoid reinitializing it
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  if (e.code === 'auth/already-initialized') {
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

// Initialize Firestore
export const db = getFirestore(app);

export { auth };
