import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "AIzaSyCfPXk42kdOC6LJuGBQrJMZ8f3gZH6pblU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "alertgrid-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "alertgrid-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "alertgrid-ai.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "476924851427",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "1:688753231454:web:8655e8c338421b8b60f580",
};

// Prevent multiple Firebase instances
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);