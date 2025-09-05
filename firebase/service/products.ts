import { db, collection, getDocs, query, where, doc, getDoc } from '../firebase';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Type definitions
export interface Product {
  id: number;
  name: string;
  image: string;
  color: string;
  size: string;
  product_type: string;
  collection_id: number;
  collection_name: string;
}

/**
 * Get all products from Firestore
 * @returns Array of all products from Firestore
 */
export const getAllProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    const products: Product[] = querySnapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      console.log('Raw Firestore data:', data); // Debug log
      const product = {
        id: data.id || Number(docSnap.id), // Use data.id if available, fallback to docSnap.id
        ...data,
      } as Product;
      console.log('Processed product:', product); // Debug log
      return product;
    });

    console.log('Final products array:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error getting products from Firestore:', error);
    throw error;
  }
};

/**
 * Get products by collection ID from Firestore
 * @param collectionId - The collection ID to filter products by
 * @returns Array of products belonging to the specified collection
 */
export const getProductsByCollectionIdFromFirestore = async (
  collectionId: number
): Promise<Product[]> => {
  try {
    console.log('Fetching products for collection ID:', collectionId); // Debug log
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('collection_id', '==', collectionId));
    const querySnapshot = await getDocs(q);

    const products: Product[] = querySnapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      console.log('Raw collection product data:', data); // Debug log
      const product = {
        id: data.id || Number(docSnap.id),
        ...data,
      } as Product;
      console.log('Processed collection product:', product); // Debug log
      return product;
    });

    console.log('Final collection products array:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error getting products by collection ID from Firestore:', error);
    throw error;
  }
};

/**
 * Get product by ID from Firestore
 * @param id - The product ID (document ID in Firestore)
 * @returns Product object or null
 */
export const getProductByIdFromFirestore = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: data.id || Number(docSnap.id),
        ...data,
      } as Product;
    }

    return null;
  } catch (error) {
    console.error('Error getting product by ID from Firestore:', error);
    throw error;
  }
};

/**
 * Get products by name from Firestore
 * @param name - The product name to search for
 * @returns Array of products matching the name search
 */
export const getProductsByNameFromFirestore = async (name: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    const querySnapshot = await getDocs(q);

    const products: Product[] = querySnapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      return {
        id: data.id || Number(docSnap.id),
        ...data,
      } as Product;
    });

    return products;
  } catch (error) {
    console.error('Error getting products by name from Firestore:', error);
    throw error;
  }
};

/**
 * Get products by type from Firestore
 * @param productType - The product type to filter by
 * @returns Array of products matching the type
 */
export const getProductsByTypeFromFirestore = async (productType: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('product_type', '==', productType));
    const querySnapshot = await getDocs(q);

    const products: Product[] = querySnapshot.docs.map((docSnap: any) => {
      const data = docSnap.data();
      return {
        id: data.id || Number(docSnap.id),
        ...data,
      } as Product;
    });

    return products;
  } catch (error) {
    console.error('Error getting products by type from Firestore:', error);
    throw error;
  }
};
