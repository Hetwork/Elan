import { useQuery } from '@tanstack/react-query';
import {
  getAllCollectionsFromFirestore,
  getCollectionByNameFromFirestore,
  getCollectionByIdFromFirestore,
  type Collection,
} from '../service/collection';

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...collectionKeys.details(), id] as const,
  byName: (name: string) => [...collectionKeys.all, 'byName', name] as const,
};

// ==========================
// Firestore hooks
// ==========================

/**
 * Hook to get all collections from Firestore
 */
export const useGetAllCollectionsFromFirestore = () => {
  return useQuery<Collection[]>({
    queryKey: [...collectionKeys.lists(), 'firestore'],
    queryFn: getAllCollectionsFromFirestore,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get collection by ID from Firestore
 */
export const useGetCollectionByIdFromFirestore = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<Collection | null>({
    queryKey: [...collectionKeys.detail(id), 'firestore'],
    queryFn: () => getCollectionByIdFromFirestore(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get collection by name from Firestore
 */
export const useGetCollectionByNameFromFirestore = (
  name: string,
  enabled: boolean = true
) => {
  return useQuery<Collection | null>({
    queryKey: [...collectionKeys.byName(name), 'firestore'],
    queryFn: () => getCollectionByNameFromFirestore(name),
    enabled: enabled && !!name.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ==========================
// Helper hooks
// ==========================

/**
 * Hook to get collection names only (useful for dropdowns)
 */
export const useGetCollectionNames = () => {
  return useQuery<{ id: number | string; name: string }[]>({
    queryKey: [...collectionKeys.all, 'names'],
    queryFn: async () => {
      const collections = await getAllCollectionsFromFirestore();
      return collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to get all collections (alias for compatibility)
 */
export const useGetAllCollections = () => {
  return useGetAllCollectionsFromFirestore();
};
