import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBEAT2ltbmFKzHCV9d_bHX1mz-9PjNjdAA",
  authDomain: "gita-quiz.firebaseapp.com",
  projectId: "gita-quiz",
  storageBucket: "gita-quiz.appspot.com",
  messagingSenderId: "638949342722",
  appId: "1:638949342722:web:e12cc42de7206dab38311b",
  measurementId: "G-GZ2E9VW9KD"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const db = getFirestore(app);

export {app, auth, db}

