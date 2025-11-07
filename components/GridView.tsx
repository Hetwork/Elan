import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  productCount?: string;
  image?: string;
  main_image?: string;
  cut_image?: string;
  description?: string;
  colors?: string[];
  text_colors?: string[];
}

interface GridViewProps {
  products: Product[];
}

export default function GridView({ products }: GridViewProps) {
  const router = useRouter();
  
  // Handle navigation to horizontal page with collection data
  const handleProductPress = (collection: Product) => {
    // Just pass the collection ID, let horizontal page fetch complete data
    router.push({
      pathname: '/horizontal',
      params: {
        collectionId: collection.id.toString(),
      },
    });
  };

  // Animation values for each item
  const animationValues = useRef(
    products.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Animate items in with staggered timing
    const animations = animationValues.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 500,
          delay: index * 80, // Stagger by 80ms
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 500,
          delay: index * 80, // Stagger by 80ms
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(40, animations).start();
  }, []);

  // Render Grid View Header
  const renderGridHeader = () => (
    <View style={styles.titleSection}>
      <Text style={styles.mainTitle}>Explore Elan{'\n'}dinnerware collections</Text>
      <Text style={styles.subtitle}>
        Our collection is designed to engage all of the{'\n'}
        senses. Rich colors and beautifully textured finishes{'\n'}
        transform every meal into a dish worth celebrating.
      </Text>
    </View>
  );

  // Render Grid View Product Card
  const renderProductCard = ({ item, index }: { item: Product; index: number }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={{ uri: item.main_image || item.image || '' }} 
            style={[
              styles.gridProductImage,
              {
                opacity: animationValues[index]?.opacity || 0,
                transform: [
                  {
                    scale: animationValues[index]?.scale || 0,
                  },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCount}>{item.productCount || 'Collection'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProductCard}
      numColumns={2}
      ListHeaderComponent={renderGridHeader}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.flatListContent}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 100, // Add padding to account for fixed header
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20, // Reduced since header is now fixed
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#393939',
    lineHeight: 52,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#393939',
    lineHeight: 24,
  },
  productCard: {
    width: (width - 60) / 2, // Two columns with spacing
    marginBottom: 30,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: '#ababa6',
    borderRadius: 16,
  },
  gridProductImage: {
    width: '100%',
    height: '100%',
    // borderRadius: 100,
    resizeMode: 'contain'
  },
  productInfo: {
    padding: 20,
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#393939',
    marginBottom: 8,
  },
  productCount: {
    fontSize: 14,
    color: '#393939',
    fontWeight: '400',
  },
});
