// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCgijDWtPMXtGWK8R1p4_vxpZejvYr-gG8",
  authDomain: "art-bloom.firebaseapp.com",
  projectId: "art-bloom",
  storageBucket: "art-bloom.firebasestorage.app",
  messagingSenderId: "928306775993",
  appId: "1:928306775993:web:a91aea229c0cf50a979868",
  measurementId: "G-1YMLKGHP3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;