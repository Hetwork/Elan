import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetProductsByCollectionIdFromFirestore } from '../utils/Hooks/ProductsHook';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedProductPage = ({
  product,
  index,
  scrollY,
}: {
  product: any;
  index: number;
  scrollY: Animated.SharedValue<number>;
}) => {
  const pageStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * height, index * height, (index + 1) * height];
    const scale = interpolate(scrollY.value, inputRange, [0.85, 1, 0.85], Extrapolate.CLAMP);

    return { 
      transform: [{ scale }],
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  return (
    <Animated.View style={[styles.pageContainer, pageStyle]}>
      <Image source={{ uri: product.image }} style={styles.mainImage} resizeMode="contain" />
    </Animated.View>
  );
};

export default function MiamiProducts() {
  const { collectionId } = useLocalSearchParams();
  const actualCollectionId = collectionId ? Number(collectionId) : 3;

  const { data: products = [], isLoading, error } =
    useGetProductsByCollectionIdFromFirestore(actualCollectionId, true);

  // ✅ Hooks always called
  const scrollY = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateCurrentProduct = (scrollValue: number) => {
    const index = Math.round(scrollValue / height);
    if (index !== currentIndex && index >= 0 && index < products.length) {
      setCurrentIndex(index);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(updateCurrentProduct)(event.contentOffset.y);
    },
  });

  const getCurrentProduct = () => products[currentIndex] || products[0];

  // ✅ UI states handled inside return
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={{ marginTop: 10, color: '#333' }}>Loading products...</Text>
      </View>
    );
  }

  if (error || !products.length) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#333', fontSize: 16 }}>
          {error ? 'Error loading products' : 'No products found for this collection'}
        </Text>
      </View>
    );
  }

  // ✅ Normal render
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Left thumbnails */}
        <View style={styles.leftContent}>
          <Text style={styles.elanText}>Elan</Text>
          <Text style={styles.miamiTitle} numberOfLines={3} ellipsizeMode="tail">
            {products[0].collection_name}
          </Text>

          <View style={styles.thumbnailsContainer}>
            {products.map((product, index) => (
              <TouchableOpacity key={index} style={styles.thumbnailContainer}>
                <Image source={{ uri: product.image }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Center scroll images */}
        <View style={styles.centerImageContainer}>
          <Animated.ScrollView
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            style={styles.pageScrollView}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            {products.map((product, index) => (
              <AnimatedProductPage
                key={product.id}
                product={product}
                index={index}
                scrollY={scrollY}
              />
            ))}
          </Animated.ScrollView>
        </View>

        {/* Product info */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{getCurrentProduct()?.name}</Text>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreText}>explore collection</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Page indicators */}
        <View style={styles.pageIndicatorContainer}>
          {products.map((_, index) => (
            <View
              key={index}
              style={[styles.pageIndicator, currentIndex === index && styles.activePageIndicator]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f0' },
  mainContent: { flex: 1, position: 'relative' },

  leftContent: { position: 'absolute', top: 60, left: 20, zIndex: 5 },
  elanText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  miamiTitle: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: -3,
    lineHeight: 80,
    marginBottom: 20,
    width: width * 0.9, // Limit width to prevent overflow
    flexWrap: 'wrap',
  },

  thumbnailsContainer: { flexDirection: 'column' },
  thumbnailContainer: {
    width: 50,
    height: 50,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  thumbnail: { width: '100%', height: '100%' },

  centerImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    zIndex: 100,
  },
  pageScrollView: { flex: 1, width: '100%' },
  pageContainer: { width, height, alignItems: 'center', justifyContent: 'center' },
  mainImage: { width: width * 0.7, height: width * 0.7 },

  pageIndicatorContainer: {
    position: 'absolute',
    top: height * 0.5,
    right: 20,
    flexDirection: 'column',
    zIndex: 15,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  activePageIndicator: { backgroundColor: '#333', width: 10, height: 10, borderRadius: 5 },

  productInfoContainer: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    zIndex: 20,
    alignItems: 'flex-end',
  },
  productTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 15 },
  exploreButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: { color: 'white', fontSize: 14, fontWeight: '500', marginRight: 8 },
  arrow: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
