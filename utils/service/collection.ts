import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import collectionData from '../../json/collection.json';

// Type definitions
export interface Collection {
  id: number;
  name: string;
  color: string;
  textcolor: string;
  main_image: string[];
  description: string;
  products: number;
  materials: string;
  color_palette: string;
  cut_image: string;
  sub_description: string;
  parallax_image: string;
  dish_description: string;
  dish_image: string;
  dish_background: string;
}

/**
 * Get all collections from local JSON file
 * @returns Array of all collections
 */
export const getAllCollections = async () => {
  try {
    return collectionData as Collection[];
  } catch (error) {
    console.error('Error getting all collections:', error);
    throw error;
  }
};

/**
 * Get collection by name from local JSON file
 * @param name - The name of the collection to find
 * @returns Collection object or null if not found
 */
export const getCollectionByName = async (name: string) => {
  try {
    const collections = collectionData as Collection[];
    const collection = collections.find(
      (collection) => collection.name.toLowerCase() === name.toLowerCase()
    );
    return collection || null;
  } catch (error) {
    console.error('Error getting collection by name:', error);
    throw error;
  }
};

/**
 * Get collection by ID from local JSON file
 * @param id - The ID of the collection to find
 * @returns Collection object or null if not found
 */
export const getCollectionById = async (id: number) => {
  try {
    const collections = collectionData as Collection[];
    const collection = collections.find((collection) => collection.id === id);
    return collection || null;
  } catch (error) {
    console.error('Error getting collection by ID:', error);
    throw error;
  }
};

// Firebase-based functions (alternative implementation)
/**
 * Get all collections from Firestore
 * @returns Array of all collections from Firestore
 */
export const getAllCollectionsFromFirestore = async () => {
  try {
    const collectionsRef = collection(db, 'collections');
    const querySnapshot = await getDocs(collectionsRef);
    
    const collections: Collection[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      collections.push({ 
        id: parseInt(doc.id), 
        ...data 
      } as unknown as Collection);
    });
    
    return collections;
  } catch (error) {
    console.error('Error getting collections from Firestore:', error);
    throw error;
  }
};

/**
 * Get collection by name from Firestore
 * @param name - The name of the collection to find
 * @returns Collection object or null if not found
 */
export const getCollectionByNameFromFirestore = async (name: string) => {
  try {
    const collectionsRef = collection(db, 'collections');
    const q = query(collectionsRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return { 
      id: parseInt(doc.id), 
      ...data 
    } as unknown as Collection;
  } catch (error) {
    console.error('Error getting collection by name from Firestore:', error);
    throw error;
  }
};