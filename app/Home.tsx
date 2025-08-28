import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Fontisto, AntDesign, Feather } from '@expo/vector-icons';
import ExperienceView from '../components/ExperienceView';
import GridView from '../components/GridView';
import { useGetAllProducts } from '../utils/Hooks/ProductsHook';
import { useGetAllCollections } from '../utils/Hooks/collectionHook';

const { width } = Dimensions.get('window');

export default function App() {
  const [isExperienceView, setIsExperienceView] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Fetch data using TanStack Query hooks
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProducts();
  const { data: collections = [], isLoading: collectionsLoading, error: collectionsError } = useGetAllCollections();

  // Debug: Log data when it loads
  React.useEffect(() => {
    if (products.length > 0) {
      console.log(`Loaded ${products.length} products`);
    }
    if (collections.length > 0) {
      console.log(`Loaded ${collections.length} collections`);
    }
  }, [products, collections]);

  const toggleView = () => {
    setIsExperienceView(!isExperienceView);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Show loading indicator while data is being fetched
  if (productsLoading || collectionsLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show error state if data failed to load
  if (productsError || collectionsError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  // Transform products data for ExperienceView
  const transformedProducts = products
    .filter(product => product.name && product.image) // Filter out empty products
    .map(product => ({
      id: product.id,
      name: product.name,
      productCount: `${product.product_type} - ${product.size}`,
      image: product.image,
    }));

  // Transform collections data for GridView
  const transformedCollections = collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    productCount: `${collection.products} Products`,
    image: collection.dish_image,
    color: collection.color,
    textColor: collection.textcolor,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Content Area */}
      {isExperienceView ? (
        <ExperienceView products={transformedProducts} />
      ) : (
        <GridView products={transformedCollections} />
      )}

      {/* Top Header - Floating */}
      <View style={styles.headerFloating}>
        {/* Elan Text */}
        <Text style={styles.elanText}>Elan</Text>

        {/* Experience View Button */}
        <TouchableOpacity style={styles.experienceButton} onPress={toggleView}>
          {/* Icon based on current view */}
          {isExperienceView ? (
            <FontAwesome name="connectdevelop" size={16} color="black" style={styles.iconMargin} />
          ) : (
            <Fontisto name="nav-icon-grid-a" size={16} color="black" style={styles.iconMargin} />
          )}
          <Text style={styles.experienceButtonText}>
            {isExperienceView ?  'experience view' : 'grid view'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation - Floating */}
      <View style={styles.bottomNavigationFloating}>
        {/* Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          {/* Icon changes based on menu state */}
          {isMenuVisible ? (
            // Cross Icon only
            <AntDesign name="close" size={18} color="white" />
          ) : (
            // Hamburger Icon with menu text
            <>
              <Feather name="menu" size={18} color="white" style={styles.iconContainer} />
              <Text style={styles.menuButtonText}>menu</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Filter Button */}
        <TouchableOpacity style={styles.filterButton} onPress={() => alert('Filter pressed')}>
          {/* Filter Icon */}
          <AntDesign name="filter" size={18} color="#333" style={styles.iconContainer} />
          <Text style={styles.filterButtonText}>filter</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      {isMenuVisible && (
        <View style={styles.menuModal}>
          {/* Menu Items - Vertical Layout */}
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                alert('Collections pressed');
              }}>
              <View style={styles.menuDot} />
              <Text style={styles.menuItemText}>collections</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                alert('About pressed');
              }}>
              <Text style={[styles.menuItemText, styles.menuItemTextIndent]}>about</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                alert('Contact pressed');
              }}>
              <Text style={[styles.menuItemText, styles.menuItemTextIndent]}>contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f3',
  },
  // Loading and error states
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  // Header styles
  headerFloating: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1000,
    backgroundColor: 'rgba(248, 248, 243, 0)',
  },
  elanText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
  },
  experienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
  },
  iconMargin: {
    marginRight: 8,
  },
  experienceButtonText: {
    fontSize: 14,
    color: '#666',
  },
  // Bottom navigation styles
  bottomNavigationFloating: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1000,
    backgroundColor: 'rgba(248, 248, 243, 0)',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  menuButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // Menu modal styles
  menuModal: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    minWidth: 150,
    zIndex: 2000,
  },
  menuItemView: {
    paddingVertical: 8,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  menuDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemTextIndent: {
    marginLeft: 18,
  },
});
