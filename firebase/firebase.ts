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

// React Native Firebase configuration
console.log('Using React Native Firebase');

// Import and use default instances
const authDefault = require('@react-native-firebase/auth').default;
const firestoreDefault = require('@react-native-firebase/firestore').default;

auth = authDefault();
db = firestoreDefault();console.log('Firebase auth ready');
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
