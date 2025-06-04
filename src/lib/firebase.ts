
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error(
    "FATAL: NEXT_PUBLIC_FIREBASE_API_KEY is missing or not defined. Firebase cannot be initialized correctly. Ensure this environment variable is set in your deployment environment (e.g., Vercel project settings)."
  );
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  console.error("WARNING: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("WARNING: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing.");
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
