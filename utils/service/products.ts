import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import productsData from '../../json/products.json';

// Type definitions
export interface Product {
  id: number;
  name: string;
  image: string;
  color: string;
  size: string;
  product_type: string;
  collection_id: number;
}

/**
 * Get all products from local JSON file
 * @returns Array of all products
 */
export const getAllProducts = async () => {
  try {
    return productsData as Product[];
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

/**
 * Get products by collection ID from local JSON file
 * @param collectionId - The collection ID to filter products by
 * @returns Array of products belonging to the specified collection
 */
export const getProductsByCollectionId = async (collectionId: number) => {
  try {
    const products = productsData as Product[];
    const filteredProducts = products.filter(
      (product) => product.collection_id === collectionId
    );
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products by collection ID:', error);
    throw error;
  }
};

/**
 * Get product by ID from local JSON file
 * @param id - The ID of the product to find
 * @returns Product object or null if not found
 */
export const getProductById = async (id: number) => {
  try {
    const products = productsData as Product[];
    const product = products.find((product) => product.id === id);
    return product || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

/**
 * Get products by name (partial match) from local JSON file
 * @param name - The name to search for (case-insensitive partial match)
 * @returns Array of products matching the name
 */
export const getProductsByName = async (name: string) => {
  try {
    const products = productsData as Product[];
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products by name:', error);
    throw error;
  }
};

/**
 * Get products by type from local JSON file
 * @param productType - The product type to filter by
 * @returns Array of products of the specified type
 */
export const getProductsByType = async (productType: string) => {
  try {
    const products = productsData as Product[];
    const filteredProducts = products.filter(
      (product) => product.product_type.toLowerCase() === productType.toLowerCase()
    );
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products by type:', error);
    throw error;
  }
};

// Firebase-based functions (alternative implementation)
/**
 * Get all products from Firestore
 * @returns Array of all products from Firestore
 */
export const getAllProductsFromFirestore = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: parseInt(doc.id), 
        ...data 
      } as unknown as Product);
    });
    
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
export const getProductsByCollectionIdFromFirestore = async (collectionId: number) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('collection_id', '==', collectionId));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({ 
        id: parseInt(doc.id), 
        ...data 
      } as unknown as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by collection ID from Firestore:', error);
    throw error;
  }
};