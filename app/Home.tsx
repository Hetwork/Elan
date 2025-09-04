import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { FontAwesome, Fontisto, AntDesign, Feather } from '@expo/vector-icons';
import ExperienceView from '../components/ExperienceView';
import GridView from '../components/GridView';
import { useGetAllProducts } from '../utils/Hooks/ProductsHook';
import { useGetAllCollections } from '../utils/Hooks/collectionHook';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function App() {
  const [isExperienceView, setIsExperienceView] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isColorPaletteVisible, setIsColorPaletteVisible] = useState(false);
  const [isTypePaletteVisible, setIsTypePaletteVisible] = useState(false);
  const [isSizePaletteVisible, setIsSizePaletteVisible] = useState(false);
  const [sizeRange, setSizeRange] = useState({ min: 6, max: 29 });
  
  // Filter states
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Slider handle positions (relative to slider container)
  const [minHandlePosition, setMinHandlePosition] = useState(85); // bottom position (6cm)
  const [maxHandlePosition, setMaxHandlePosition] = useState(15); // top position (29cm)
  
  // Slider configuration
  const sliderHeight = 96; // 80% of 120px container height
  const minValue = 6;
  const maxValue = 29;
  
  // Convert position to value
  const positionToValue = (position: number) => {
    const percentage = (sliderHeight - position + 10) / sliderHeight;
    return Math.round(minValue + (percentage * (maxValue - minValue)));
  };
  
  // Convert value to position
  const valueToPosition = (value: number) => {
    const percentage = (value - minValue) / (maxValue - minValue);
    return sliderHeight - (percentage * sliderHeight) + 10;
  };
  
  // Pan responder for min handle (bottom)
  const minHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      let newPosition = minHandlePosition + gestureState.dy;
      // Constrain position
      newPosition = Math.max(15, Math.min(85, newPosition));
      // Ensure min handle stays below max handle
      if (newPosition <= maxHandlePosition + 10) {
        newPosition = maxHandlePosition + 10;
      }
      setMinHandlePosition(newPosition);
      const newValue = positionToValue(newPosition);
      setSizeRange(prev => ({ ...prev, min: newValue }));
    },
    onPanResponderRelease: () => {},
  });
  
  // Pan responder for max handle (top)
  const maxHandlePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      let newPosition = maxHandlePosition + gestureState.dy;
      // Constrain position
      newPosition = Math.max(15, Math.min(85, newPosition));
      // Ensure max handle stays above min handle
      if (newPosition >= minHandlePosition - 10) {
        newPosition = minHandlePosition - 10;
      }
      setMaxHandlePosition(newPosition);
      const newValue = positionToValue(newPosition);
      setSizeRange(prev => ({ ...prev, max: newValue }));
    },
    onPanResponderRelease: () => {},
  });

  // Fetch data using TanStack Query hooks
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProducts();
  const { data: collections = [], isLoading: collectionsLoading, error: collectionsError } = useGetAllCollections();

  // console.log("Products:", products);
  // Debug: Log data when it loads
  // React.useEffect(() => {
  //   if (products.length > 0) {
  //     console.log(`Loaded ${products.length} products`);
  //   }
  //   if (collections.length > 0) {
  //     console.log(`Loaded ${collections.length} collections`);
  //   }
  // }, [products, collections]);

  const toggleView = () => {
    setIsExperienceView(!isExperienceView);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    // Close color palette when filter modal closes
    if (isFilterVisible) {
      setIsColorPaletteVisible(false);
      setIsTypePaletteVisible(false);
      setIsSizePaletteVisible(false);
    }
  };

  const toggleColorPalette = () => {
    setIsColorPaletteVisible(!isColorPaletteVisible);
  };

  const toggleTypePalette = () => {
    setIsTypePaletteVisible(!isTypePaletteVisible);
  };

  const toggleSizePalette = () => {
    setIsSizePaletteVisible(!isSizePaletteVisible);
  };

  const clearAllFilters = () => {
    setSelectedColor(null);
    setSelectedType(null);
    setSizeRange({ min: 6, max: 29 });
    setMinHandlePosition(85);
    setMaxHandlePosition(15);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedColor || selectedType || sizeRange.min > 6 || sizeRange.max < 29;

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
    .filter(product => {
      // Apply color filter
      if (selectedColor && product.color !== selectedColor) {
        return false;
      }
      
      // Apply type filter
      if (selectedType && product.product_type !== selectedType) {
        return false;
      }
      
      // Apply size filter (convert string size to number for comparison)
      const productSize = parseInt(product.size);
      if (productSize < sizeRange.min || productSize > sizeRange.max) {
        return false;
      }
      
      return true;
    })
    .map(product => ({
      ...product, // Preserve all original fields
      productCount: `${product.product_type} - ${product.size}`, // Add computed field
    }));

  // Transform collections data for GridView
  const transformedCollections = collections.map((collection: any) => ({
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
        {isExperienceView && 
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            hasActiveFilters && styles.filterButtonActive
          ]} 
          onPress={toggleFilter}>
          {/* Filter Icon changes based on filter state */}
          {isFilterVisible ? (
            // Cross Icon only
            <AntDesign name="close" size={18} color="#333" />
          ) : (
            // Filter Icon with filter text
            <>
              <AntDesign name="filter" size={18} color="#333" style={styles.iconContainer} />
              <Text style={styles.filterButtonText}>
                {hasActiveFilters ? 'filter (active)' : 'filter'}
              </Text>
            </>
          )}
        </TouchableOpacity>}
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
                router.push('/contact');
              }}>
              <Text style={[styles.menuItemText, styles.menuItemTextIndent]}>contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filter Modal */}
      {isFilterVisible && (
        <View style={styles.filterModal}>
          {/* Filter Items - Vertical Layout */}
          <View style={styles.filterItemView}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={toggleColorPalette}>
              <View style={styles.filterIconContainer}>
                <View style={styles.colorIconsGroup}>
                  <View style={[styles.miniColorIcon, { backgroundColor: '#FF6B6B' }]} />
                  <View style={[styles.miniColorIcon, { backgroundColor: '#4ECDC4', marginLeft: -2 }]} />
                  <View style={[styles.miniColorIcon, { backgroundColor: '#45B7D1', marginLeft: -2 }]} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.filterItemView}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={toggleTypePalette}>
              <View style={styles.filterIconContainer}>
                <AntDesign name="appstore-o" size={16} color="#333" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.filterItemView}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={toggleSizePalette}>
              <View style={styles.filterIconContainer}>
                <FontAwesome name="arrows-alt" size={14} color="#333" />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Clear Filters Button - Only show if filters are active */}
          {hasActiveFilters && (
            <View style={styles.filterItemView}>
              <TouchableOpacity
                style={[styles.filterItem, styles.clearFiltersButton]}
                onPress={() => {
                  clearAllFilters();
                  setIsFilterVisible(false);
                }}>
                <View style={styles.filterIconContainer}>
                  <AntDesign name="retweet" size={14} color="#333s" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Color Palette Modal */}
      {isColorPaletteVisible && (
        <View style={styles.colorPaletteModal}>
          <View style={styles.colorPaletteContainer}>
            {/* Color Options */}
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('Pink');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#FFB6C1' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('Peach');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#FFDAB9' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('Brown');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#8B4513' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('Gray');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#808080' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('White');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E0E0E0' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.colorOption}
              onPress={() => {
                setSelectedColor('Green');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#6B8E23' }]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.colorOption,
                selectedColor === 'Blue' && styles.selectedOption
              ]}
              onPress={() => {
                setSelectedColor('Blue');
                setIsColorPaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <View style={[styles.colorCircle, { backgroundColor: '#4169E1' }]} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Type Palette Modal */}
      {isTypePaletteVisible && (
        <View style={styles.typePaletteModal}>
          <View style={styles.typePaletteContainer}>
            {/* Type Options */}
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType('Plate');
                setIsTypePaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <Text style={styles.typeText}>Deep Plate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType('Saucer');
                setIsTypePaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <Text style={styles.typeText}>Saucer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType('Cup');
                setIsTypePaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <Text style={styles.typeText}>Cup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType('Bowl');
                setIsTypePaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <Text style={styles.typeText}>Bowl</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                setSelectedType('Plate');
                setIsTypePaletteVisible(false);
                setIsFilterVisible(false);
              }}>
              <Text style={styles.typeText}>Plate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Size Palette Modal */}
      {isSizePaletteVisible && (
        <View style={styles.sizePaletteModal}>
          <View style={styles.sizePaletteContainer}>
            {/* Top Size Display - Max Value (29cm at top) */}
            <View style={styles.sizeValueContainer}>
              <Text style={styles.sizeValueText}>ø {sizeRange.max} cm</Text>
            </View>
            
            {/* Vertical Slider Container */}
            <View style={styles.verticalSliderContainer}>
              {/* Slider Track */}
              <View style={styles.sliderTrack} />
              
              {/* Max Handle (top handle - controls max value) */}
              <View 
                style={[styles.sliderHandle, { top: maxHandlePosition }]}
                {...maxHandlePanResponder.panHandlers}
              >
                <View style={styles.sliderDot} />
              </View>
              
              {/* Min Handle (bottom handle - controls min value) */}
              <View 
                style={[styles.sliderHandle, { top: minHandlePosition }]}
                {...minHandlePanResponder.panHandlers}
              >
                <View style={styles.sliderDot} />
              </View>
              
              {/* Active range track between handles */}
              <View style={[styles.activeTrack, { 
                top: maxHandlePosition + 10, 
                height: minHandlePosition - maxHandlePosition
              }]} />
            </View>
            
            {/* Bottom Size Display - Min Value (6cm at bottom) */}
            <View style={styles.sizeValueContainer}>
              <Text style={styles.sizeValueText}>ø {sizeRange.min} cm</Text>
            </View>
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
  filterButtonActive: {
    backgroundColor: 'rgba(51, 51, 51, 0.1)',
    borderColor: '#333',
    borderWidth: 2,
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
  // Filter modal styles
  filterModal: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    minWidth: 60,
    zIndex: 2000,
  },
  filterItemView: {
    paddingVertical: 4,
    borderRadius: 8,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
  },
  filterIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(180, 180, 180, 0.8)',
  },
  colorIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  colorIconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniColorIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // Color palette modal styles
  colorPaletteModal: {
    position: 'absolute',
    bottom: 100,
    right: 90, // Position to the left of the filter modal
    zIndex: 2100, // Higher than filter modal
  },
  colorPaletteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  colorOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(51, 51, 51, 0.1)',
    borderRadius: 12,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Type palette modal styles
  typePaletteModal: {
    position: 'absolute',
    bottom: 164, // Position above the middle filter item
    right: 90, // Position to the left of the filter modal
    zIndex: 2100, // Higher than filter modal
  },
  typePaletteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  typeOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Size palette modal styles
  sizePaletteModal: {
    position: 'absolute',
    bottom: 100, // Position above the bottom filter item
    right: 90, // Position to the left of the filter modal
    zIndex: 2100, // Higher than filter modal
  },
  sizePaletteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  sizeValueContainer: {
    marginVertical: 5,
    alignItems: 'center',
  },
  sizeValueText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  sizeHeader: {
    marginBottom: 12,
  },
  sizeHeaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  sizeRangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sizeRangeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  verticalSliderContainer: {
    height: 120,
    width: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: 'rgba(248, 248, 248, 0.8)',
    borderRadius: 20,
    paddingVertical: 10,
  },
  sliderTrack: {
    position: 'absolute',
    width: 4,
    height: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    left: '50%',
    marginLeft: -2,
  },
  activeTrack: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    left: '50%',
    marginLeft: -2,
  },
  sliderHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    marginLeft: -10,
  },
  sliderDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
