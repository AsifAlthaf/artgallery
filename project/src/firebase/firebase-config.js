import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCgijDWtPMXtGWK8R1p4_vxpZejvYr-gG8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "art-bloom.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "art-bloom",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "art-bloom.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928306775993",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:928306775993:web:a91aea229c0cf50a979868",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1YMLKGHP3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics is disabled here to avoid Firebase Hosting init lookups and console noise.
export const analytics = null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;