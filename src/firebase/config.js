// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this line

// ✅ Corrected storageBucket URL (.com not .app)
const firebaseConfig = {
  apiKey: "AIzaSyDZpbigsEjCqJ0nxVAJBUHrZk2i1OJTbAY",
  authDomain: "campus-utilities-69aa0.firebaseapp.com",
  projectId: "campus-utilities-69aa0",
  storageBucket: "campus-utilities-69aa0.appspot.com", // ✅ FIXED this
  messagingSenderId: "474754755772",
  appId: "1:474754755772:web:bca07c771c4ba0c94634b9",
  measurementId: "G-WXNGZG7GQH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Add this line
