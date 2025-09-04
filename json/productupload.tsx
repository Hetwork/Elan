// // firebaseImport.js
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
// // import collections from "./collection.json"; // import JSON file
// import products from "./products.json";

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyA7PMCM6NBkGdEz1yGV_h2--Gr2K-VCxYI",
//   authDomain: "elan-6e518.firebaseapp.com",
//   projectId: "elan-6e518",
//   storageBucket: "elan-6e518.firebasestorage.app",
//   messagingSenderId: "807629395019",
//   appId: "1:807629395019:web:7db4438cbfa0c75bd5e9ce",
//   measurementId: "G-BZMEQ4QN73"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to upload products
// export async function uploadProducts() {
//   try {
//     for (const product of products) {
//       // Use custom `id` as document ID
//       await setDoc(doc(db, "products", product.id.toString()), product);
//       console.log(`✅ Added: ${product.name} (ID: ${product.id})`);
//     }
//     console.log("🎉 All products uploaded successfully!");
//   } catch (error) {
//     console.error("❌ Error uploading products:", error);
//   }
// }

// // Run function
// // uploadProducts()
