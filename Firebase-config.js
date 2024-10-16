// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
=======
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
>>>>>>> bc2304db33945a9b8adab6fa53dc0bcd9210c53c
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
<<<<<<< HEAD

export const auth = getAuth(app);
export const db = getFirestore(app);
=======
export const auth = initializeAuth(app);
export const db = getFirestore(app)
>>>>>>> bc2304db33945a9b8adab6fa53dc0bcd9210c53c
