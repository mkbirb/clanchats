// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmO7e7PuhrXSGuPPJboUtF2rLwtnUneU8",
  authDomain: "clanchat-f050c.firebaseapp.com",
  projectId: "clanchat-f050c",
  storageBucket: "clanchat-f050c.firebasestorage.app",
  messagingSenderId: "544996756324",
  appId: "1:544996756324:web:ae9ec56f7e978feea24871",
  measurementId: "G-QNX9LK9W96",
  databaseURL: "https://clanchat-f050c-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);

// Initialize Realtime Database
const rtdb = getDatabase(app);

// Get the Authentication Instance
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage();

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { db, auth, storage, rtdb }; 