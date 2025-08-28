import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  runOnJS,
  withSpring
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const products = [
  {
    id: 1,
    name: 'Deep Plate ø 22',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d97012741b605f32ba31c2_Miami%20Deep%20plate%2022.webp'
  },
  {
    id: 2,
    name: 'Miami Cup 21',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96fecf0d0f1d5c1798659_Miami%20Cup%2021.webp'
  },
  {
    id: 3,
    name: 'Miami Saucer 14',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9707eab0def13c185226a_Miami%20Saucer%2014.webp'
  },
  {
    id: 4,
    name: 'Miami Pasta Plate 27',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9701f6afd5da448236c8b_Miami%20Pasta%20plate%2027.webp'
  }
];

const thumbnailImages = [
  'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d97012741b605f32ba31c2_Miami%20Deep%20plate%2022.webp',
  'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96fecf0d0f1d5c1798659_Miami%20Cup%2021.webp',
  'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9707eab0def13c185226a_Miami%20Saucer%2014.webp',
  'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9701f6afd5da448236c8b_Miami%20Pasta%20plate%2027.webp'
];

export default function MiamiProducts() {
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

  // Animation for page transitions
  const getPageStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const inputRange = [(index - 1) * height, index * height, (index + 1) * height];
      
      const scale = interpolate(
        scrollY.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
      };
    });
  };

  // Get current visible product based on index
  const getCurrentProduct = () => {
    return products[currentIndex] || products[0];
  };

  // Animation for the border on the left side
  const getBorderStyle = () => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollY.value,
        [0, height, height * 2, height * 3],
        [0, 65, 130, 195], // Match thumbnail spacing (50px height + 15px marginBottom = 65px)
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateY }],
      };
    });
  };

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Left side content - FIXED position */}
        <View style={styles.leftContent}>
          {/* Elan text - same style as home page */}
          <Text style={styles.elanText}>Elan</Text>
          
          {/* Miami title below Elan */}
          <Text style={styles.miamiTitle}>Miami</Text>
          
          {/* Small thumbnail images below Miami */}
          <View style={styles.thumbnailsContainer}>
            {thumbnailImages.map((image, index) => (
              <TouchableOpacity key={index} style={styles.thumbnailContainer}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Animated border that moves with scroll */}
          <Animated.View style={[styles.animatedBorder, getBorderStyle()]} />
        </View>

        {/* Center - Main product images in vertical page view */}
        <View style={styles.centerImageContainer}>
          <Animated.ScrollView
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            style={styles.pageScrollView}
            contentContainerStyle={styles.pageScrollContent}
          >
            {products.map((product, index) => {
              const pageStyle = getPageStyle(index);
              return (
                <Animated.View key={product.id} style={[styles.pageContainer, pageStyle]}>
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.mainImage} 
                    resizeMode="contain"
                  />
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
        </View>

        {/* Product info at bottom right - FIXED with dynamic name */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productTitle}>{getCurrentProduct().name}</Text>
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
              style={[
                styles.pageIndicator, 
                currentIndex === index && styles.activePageIndicator
              ]} 
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  leftContent: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 5,
  },
  elanText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
    marginBottom: 10,
  },
  miamiTitle: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: -3,
    lineHeight: 80,
    marginBottom: 20,
  },
  thumbnailsContainer: {
    flexDirection: 'column',
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  animatedBorder: {
    position: 'absolute',
    left: -2,
    top: 130, // Position it at the first thumbnail (after Elan + Miami text)
    width: 54,
    height: 52,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  centerImageContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  pageScrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pageScrollContent: {
    flexGrow: 1,
  },
  pageContainer: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainImage: {
    width: width * 0.85, // Much bigger image
    height: width * 0.85, // Much bigger image
  },
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
  activePageIndicator: {
    backgroundColor: '#333',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  productInfoContainer: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    zIndex: 20,
    alignItems: 'flex-end',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginBottom: 15,
  },
  exploreButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  arrow: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
