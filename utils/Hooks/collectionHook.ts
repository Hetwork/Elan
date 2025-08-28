import { useQuery } from '@tanstack/react-query';
import {
  getAllCollections,
  getCollectionByName,
  getCollectionById,
  getAllCollectionsFromFirestore,
  getCollectionByNameFromFirestore,
  type Collection
} from '../service/collection';

// Query keys
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters: string) => [...collectionKeys.lists(), { filters }] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: number) => [...collectionKeys.details(), id] as const,
  byName: (name: string) => [...collectionKeys.all, 'byName', name] as const,
};

/**
 * Hook to get all collections from local JSON
 */
export const useGetAllCollections = () => {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: getAllCollections,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get collection by ID from local JSON
 */
export const useGetCollectionById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => getCollectionById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get collection by name from local JSON
 */
export const useGetCollectionByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: collectionKeys.byName(name),
    queryFn: () => getCollectionByName(name),
    enabled: enabled && !!name,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Firestore hooks
/**
 * Hook to get all collections from Firestore
 */
export const useGetAllCollectionsFromFirestore = () => {
  return useQuery({
    queryKey: [...collectionKeys.lists(), 'firestore'],
    queryFn: getAllCollectionsFromFirestore,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get collection by name from Firestore
 */
export const useGetCollectionByNameFromFirestore = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...collectionKeys.byName(name), 'firestore'],
    queryFn: () => getCollectionByNameFromFirestore(name),
    enabled: enabled && !!name,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Helper hooks
/**
 * Hook to get collection names only (useful for dropdowns)
 */
export const useGetCollectionNames = () => {
  return useQuery({
    queryKey: [...collectionKeys.all, 'names'],
    queryFn: async () => {
      const collections = await getAllCollections();
      return collections.map(collection => ({
        id: collection.id,
        name: collection.name
      }));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};