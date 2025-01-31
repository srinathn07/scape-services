// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApn7Zr7Dyt44cPozPBjG5YjNo_OBq5qfw",
  authDomain: "scape-edcd1.firebaseapp.com",
  projectId: "scape-edcd1",
  storageBucket: "scape-edcd1.firebasestorage.app",
  messagingSenderId: "47652694061",
  appId: "1:47652694061:web:4cb3548131e933f075b0a4",
  measurementId: "G-9DKLNEZH40"
};



// Initialize Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;