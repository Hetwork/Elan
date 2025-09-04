import { Platform } from 'react-native';

let app: any,
  firestore: any,
  auth: any,
  db: any,
  collection: any,
  deleteDoc: any,
  doc: any,
  getDoc: any,
  getDocs: any,
  query: any,
  setDoc: any,
  updateDoc: any,
  addDoc: any,
  where: any,
  serverTimestamp: any,
  arrayUnion: any,
  arrayRemove: any,
  onSnapshot: any,
  Timestamp: any,
  getCountFromServer: any;

if (Platform.OS === 'web') {
  // Web Firebase imports
  firestore = require('firebase/firestore');
  collection = firestore.collection;
  deleteDoc = firestore.deleteDoc;
  doc = firestore.doc;
  getDoc = firestore.getDoc;
  getDocs = firestore.getDocs;
  query = firestore.query;
  setDoc = firestore.setDoc;
  updateDoc = firestore.updateDoc;
  addDoc = firestore.addDoc;
  where = firestore.where;
  serverTimestamp = firestore.serverTimestamp;
  arrayUnion = firestore.arrayUnion;
  arrayRemove = firestore.arrayRemove;
  onSnapshot = firestore.onSnapshot;
  Timestamp = firestore.Timestamp;
  getCountFromServer = firestore.getCountFromServer;
} else {
  // React Native Firebase imports
  firestore = require('@react-native-firebase/firestore');
  collection = firestore.collection;
  deleteDoc = firestore.deleteDoc;
  doc = firestore.doc;
  getDoc = firestore.getDoc;
  getDocs = firestore.getDocs;
  query = firestore.query;
  setDoc = firestore.setDoc;
  updateDoc = firestore.updateDoc;
  addDoc = firestore.addDoc;
  where = firestore.where;
  serverTimestamp = firestore.serverTimestamp;
  arrayUnion = firestore.arrayUnion;
  arrayRemove = firestore.arrayRemove;
  onSnapshot = firestore.onSnapshot;
  Timestamp = firestore.Timestamp;
  getCountFromServer = firestore.getCountFromServer;
}

if (Platform.OS === 'web') {
  // Web Firebase configuration
  const { initializeApp, getApps, getApp } = require('firebase/app');
  const { getAuth } = require('firebase/auth');
  const { getFirestore } = require('firebase/firestore');

  // Your Firebase web config
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
  };
  // Initialize Firebase App for web
  if (getApps().length === 0) {
    console.log('Initializing Firebase app for web');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized for web');
  } else {
    app = getApp();
    console.log('Using existing Firebase app for web');
  }

  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // React Native Firebase configuration
  console.log('Using React Native Firebase');

  // Import and use default instances
  const authDefault = require('@react-native-firebase/auth').default;
  const firestoreDefault = require('@react-native-firebase/firestore').default;
  
  auth = authDefault();
  db = firestoreDefault();
}

console.log('Firebase auth ready');
export {
  app,
  auth,
  db,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  addDoc,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  Timestamp,
  getCountFromServer,
  firestore,
};
