import { db, collection, getDocs, doc, getDoc, query, where } from '../firebase';

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
 * Get all collections from Firestore
 * @returns Array of all collections from Firestore
 */
export const getAllCollectionsFromFirestore = async (): Promise<Collection[]> => {
  try {
    const collectionsRef = collection(db, 'collections');
    const querySnapshot = await getDocs(collectionsRef);

    return querySnapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      return {
        id: data.id ?? Number(docSnap.id), // Prefer stored `id` if available
        ...data,
      } as Collection;
    });
  } catch (error) {
    console.error('Error getting collections from Firestore:', error);
    throw error;
  }
};

/**
 * Get collection by ID from Firestore
 * @param id - The Firestore document ID (string)
 * @returns Collection object or null if not found
 */
export const getCollectionByIdFromFirestore = async (
  id: string
): Promise<Collection | null> => {
  try {
    const collectionRef = doc(db, 'collections', id);
    const docSnap = await getDoc(collectionRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: data?.id ?? Number(docSnap.id),
      ...data,
    } as Collection;
  } catch (error) {
    console.error('Error getting collection by ID from Firestore:', error);
    throw error;
  }
};

/**
 * Get collection by collection ID (data field) from Firestore
 * @param collectionId - The collection ID number stored in the data
 * @returns Collection object or null if not found
 */
export const getCollectionByCollectionIdFromFirestore = async (
  collectionId: number
): Promise<Collection | null> => {
  try {
    const collectionsRef = collection(db, 'collections');
    const q = query(collectionsRef, where('id', '==', collectionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: data.id ?? Number(docSnap.id),
      ...data,
    } as Collection;
  } catch (error) {
    console.error('Error getting collection by collection ID from Firestore:', error);
    throw error;
  }
};
