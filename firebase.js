// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8i4JU1A4YOpNlNMOuEa3whNVyrNBtf9M",
    authDomain: "telanganaseemandraapp.firebaseapp.com",
    projectId: "telanganaseemandraapp",
    storageBucket: "telanganaseemandraapp.firebasestorage.app",
    messagingSenderId: "967468434934",
    appId: "1:967468434934:web:abbbc904cad0db0737b3d7",
    measurementId: "G-P7Y7ZWJTT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { auth, db };