import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyAzc6bc9ByiZ99p5g0G7MmbgMaRZj_-2dE",
  authDomain:        "southern-tales.firebaseapp.com",
  projectId:         "southern-tales",
  storageBucket:     "southern-tales.firebasestorage.app",
  messagingSenderId: "1054009904247",
  appId:             "1:1054009904247:web:4c7c8c5498f93ccd348a72",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);