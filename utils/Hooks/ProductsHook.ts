import { useQuery } from '@tanstack/react-query';
import {
  getAllProductsFromFirestore,
  getProductsByCollectionIdFromFirestore,
  getProductByIdFromFirestore,
  getProductsByNameFromFirestore,
  getProductsByTypeFromFirestore,
  type Product,
} from '../service/products';

// Query key factory for products
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byCollection: (collectionId: number) => [...productKeys.all, 'collection', collectionId] as const,
  byName: (name: string) => [...productKeys.all, 'name', name] as const,
  byType: (type: string) => [...productKeys.all, 'type', type] as const,
};

export const useGetAllProductsFromFirestore = () => {
  return useQuery<Product[]>({
    queryKey: [...productKeys.lists(), 'firestore'],
    queryFn: getAllProductsFromFirestore,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get products by collection ID from Firestore
 */
export const useGetProductsByCollectionIdFromFirestore = (
  collectionId: number,
  enabled: boolean = true
) => {
  return useQuery<Product[]>({
    queryKey: [...productKeys.byCollection(collectionId), 'firestore'],
    queryFn: () => getProductsByCollectionIdFromFirestore(collectionId),
    enabled: enabled && !!collectionId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get product by ID from Firestore
 */
export const useGetProductByIdFromFirestore = (id: string, enabled: boolean = true) => {
  return useQuery<Product | null>({
    queryKey: [...productKeys.detail(Number(id)), 'firestore'],
    queryFn: () => getProductByIdFromFirestore(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get products by name from Firestore
 */
export const useGetProductsByNameFromFirestore = (name: string, enabled: boolean = true) => {
  return useQuery<Product[]>({
    queryKey: [...productKeys.byName(name), 'firestore'],
    queryFn: () => getProductsByNameFromFirestore(name),
    enabled: enabled && !!name.trim(),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};

/**
 * Hook to get products by type from Firestore
 */
export const useGetProductsByTypeFromFirestore = (productType: string, enabled: boolean = true) => {
  return useQuery<Product[]>({
    queryKey: [...productKeys.byType(productType), 'firestore'],
    queryFn: () => getProductsByTypeFromFirestore(productType),
    enabled: enabled && !!productType.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get all products (alias for compatibility)
 */
export const useGetAllProducts = () => {
  return useGetAllProductsFromFirestore();
};
