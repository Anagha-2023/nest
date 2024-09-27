// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBICLx75haQR0GSHEBX1lQu8-tUUr9DKEQ",
  authDomain: "nestaway-727cc.firebaseapp.com",
  projectId: "nestaway-727cc",
  storageBucket: "nestaway-727cc.appspot.com",
  messagingSenderId: "916206795669",
  appId: "1:916206795669:web:e537a2b2a40f0227edd49c",
  measurementId: "G-DECBGJZC7J"
};


// Initialize Firebase Analytics (Analytics only works in the browser)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
