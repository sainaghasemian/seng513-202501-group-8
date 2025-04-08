// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhveci6NyKVmM3ZLkmJ58N4j4VSDd1iTM",
    authDomain: "uni-planner-0.firebaseapp.com",
    projectId: "uni-planner-0",
    storageBucket: "uni-planner-0.firebasestorage.app",
    messagingSenderId: "292838146079",
    appId: "1:292838146079:web:dbe75c3f9235903fba152a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);