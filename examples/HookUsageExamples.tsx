// Example usage of the TanStack Query hooks

import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { 
  useGetAllCollections, 
  useGetCollectionById, 
  useGetCollectionByName 
} from '../utils/Hooks/collectionHook';
import { 
  useGetAllProducts, 
  useGetProductsByCollectionId, 
  useGetProductById,
  useGetProductsByName,
  useGetProductsByType 
} from '../utils/Hooks/ProductsHook';

// Example: Display all collections
export const CollectionsList = () => {
  const { data: collections, isLoading, error } = useGetAllCollections();

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading collections</Text>;

  return (
    <FlatList
      data={collections}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
};

// Example: Display collection by ID
export const CollectionDetail = ({ collectionId }: { collectionId: number }) => {
  const { data: collection, isLoading, error } = useGetCollectionById(collectionId);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading collection</Text>;
  if (!collection) return <Text>Collection not found</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{collection.name}</Text>
      <Text style={{ marginTop: 10 }}>{collection.description}</Text>
      <Text style={{ marginTop: 10 }}>Products: {collection.products}</Text>
      <Text>Material: {collection.materials}</Text>
    </View>
  );
};

// Example: Display products by collection
export const ProductsByCollection = ({ collectionId }: { collectionId: number }) => {
  const { data: products, isLoading, error } = useGetProductsByCollectionId(collectionId);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading products</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          <Text>Type: {item.product_type}</Text>
          <Text>Size: {item.size}</Text>
          <Text>Color: {item.color}</Text>
        </View>
      )}
    />
  );
};

// Example: Search products by name
export const ProductSearch = ({ searchTerm }: { searchTerm: string }) => {
  const { data: products, isLoading, error } = useGetProductsByName(
    searchTerm, 
    searchTerm.length > 2 // Only search when term is longer than 2 characters
  );

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error searching products</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16 }}>{item.name}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No products found</Text>}
    />
  );
};

// Example: Filter products by type
export const ProductsByType = ({ productType }: { productType: string }) => {
  const { data: products, isLoading, error } = useGetProductsByType(productType);

  if (isLoading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error loading products</Text>;

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10 }}>
        {productType} Products
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};
