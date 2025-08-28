import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { Platform } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
let firebase;
if (getApps().length === 0) {
  firebase = initializeApp(firebaseConfig);
} else {
  firebase = getApps()[0];
}

// Initialize Firebase Auth
let auth;
try {
  // For React Native, we use initializeAuth for better persistence
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    auth = initializeAuth(firebase);
  } else {
    auth = getAuth(firebase);
  }
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(firebase);
}

// Initialize Firestore
const db = getFirestore(firebase);

// Initialize Firebase Storage
const storage = getStorage(firebase);

// Initialize Realtime Database
const database = getDatabase(firebase);

// Export Firebase services
export { auth, db, storage, database };
export default firebase;
