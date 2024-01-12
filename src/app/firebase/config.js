import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA7McfAHjmyEX1PU8hOTqm8wtKffbgS64",
  authDomain: "gita-learn-97c13.firebaseapp.com",
  projectId: "gita-learn-97c13",
  storageBucket: "gita-learn-97c13.appspot.com",
  messagingSenderId: "606672044284",
  appId: "1:606672044284:web:8bca1bd468a45d88d41779",
  measurementId: "G-1XK9SLCGF4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const db = getFirestore(app);

export {app, auth, db}

