import { useQuery } from '@tanstack/react-query';
import {
  getAllProducts,
  getProductsByCollectionId,
  getProductById,
  getProductsByName,
  getProductsByType,
  getAllProductsFromFirestore,
  getProductsByCollectionIdFromFirestore,
  type Product
} from '../service/products';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byCollection: (collectionId: number) => [...productKeys.all, 'byCollection', collectionId] as const,
  byName: (name: string) => [...productKeys.all, 'byName', name] as const,
  byType: (type: string) => [...productKeys.all, 'byType', type] as const,
};

/**
 * Hook to get all products from local JSON
 */
export const useGetAllProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get product by ID from local JSON
 */
export const useGetProductById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get products by collection ID from local JSON
 */
export const useGetProductsByCollectionId = (collectionId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.byCollection(collectionId),
    queryFn: () => getProductsByCollectionId(collectionId),
    enabled: enabled && !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get products by name from local JSON
 */
export const useGetProductsByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.byName(name),
    queryFn: () => getProductsByName(name),
    enabled: enabled && !!name && name.length > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get products by type from local JSON
 */
export const useGetProductsByType = (productType: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.byType(productType),
    queryFn: () => getProductsByType(productType),
    enabled: enabled && !!productType,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Firestore hooks
/**
 * Hook to get all products from Firestore
 */
export const useGetAllProductsFromFirestore = () => {
  return useQuery({
    queryKey: [...productKeys.lists(), 'firestore'],
    queryFn: getAllProductsFromFirestore,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get products by collection ID from Firestore
 */
export const useGetProductsByCollectionIdFromFirestore = (collectionId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...productKeys.byCollection(collectionId), 'firestore'],
    queryFn: () => getProductsByCollectionIdFromFirestore(collectionId),
    enabled: enabled && !!collectionId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Helper hooks
/**
 * Hook to get unique product types (useful for filters)
 */
export const useGetProductTypes = () => {
  return useQuery({
    queryKey: [...productKeys.all, 'types'],
    queryFn: async () => {
      const products = await getAllProducts();
      const uniqueTypes = [...new Set(products.map(product => product.product_type))];
      return uniqueTypes.filter(type => type && type.trim() !== '');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to get products count by collection
 */
export const useGetProductsCountByCollection = () => {
  return useQuery({
    queryKey: [...productKeys.all, 'countByCollection'],
    queryFn: async () => {
      const products = await getAllProducts();
      const countByCollection: Record<number, number> = {};
      
      products.forEach(product => {
        if (product.collection_id) {
          countByCollection[product.collection_id] = (countByCollection[product.collection_id] || 0) + 1;
        }
      });
      
      return countByCollection;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};