// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
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

export const auth = getAuth(app);