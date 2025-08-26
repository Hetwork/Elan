import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const images = [
  "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836d225473ef3c104f2f836_Coco%20groen%20Beautyshot.webp",
  "https://cdn.prod.website-files.com/677b8a552071e1f09b594a28/6836f65a91570332d79f23de_WM4646.webp"
];

const collectionImage = "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836d27e107b2be1f667459b_Coco%20groen%20van%20boven%207%20-%20kopie.webp";
const parallaxImage = "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836d2990c3d21f37b395928_Coco%20groene%20ondergrond%20(1).webp";
const plateImage = "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836d18c0c3d21f37b38963a_Coco%20green%20plate%2026.webp";
const backgroundImage = "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/683703bc04c2e2b84dfa13cc_francesco-ungaro-wSQdTLkVacE-unsplash.webp";
const backgroundColor = "#7b8772";
const textColor = "#eceee9";

// Product data for horizontal scroll (shown on last page)
const products = [
  {
    id: 1,
    name: "Bowl ø 9",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e0c3b1aeba6d47db3e90_Bowl%209-1.webp"
  },
  {
    id: 2,
    name: "Deep Plate ø 16",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e05bf598be5f1ff311d7_Deep%20plate%2016-1.webp"
  },
  {
    id: 3,
    name: "Plate ø 19",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836dfe00c3d21f37b42b89b_Plate%2019-2.webp"
  },
  {
    id: 4,
    name: "Plate ø 20.5",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e0d8473ef3c104fc90c8_Oval%20Plate%2020%2C5-2.webp"
  },
  {
    id: 5,
    name: "Bowl ø 12",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e0abb1aeba6d47db2946_Bowl%2012-1.webp"
  },
  {
    id: 6,
    name: "Plate ø 14.5",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e038a53cab16be969d25_Plate%2014.5-2.webp"
  },
  {
    id: 7,
    name: "Plate ø 26",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836dfb8985d194078df100f_Plate%2027%2C5-1.webp"
  }
];

export default function ElanHorizontalPager() {
  const translateX = useSharedValue(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Horizontal swipe controls horizontal scrolling
  const horizontalSwipe = Gesture.Pan().onChange((e) => {
    const newTranslateX = translateX.value + e.changeX * 1.5; // Removed minus sign for intuitive scrolling
    const maxTranslateX = 0;
    const minTranslateX = -(width * 4); // 5 pages
    translateX.value = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
  });

  // Horizontal scroll animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  // Parallax effect for full-screen image that extends behind other pages
  const parallaxStyle = useAnimatedStyle(() => {
    const parallaxOffset = interpolate(
      translateX.value,
      [-width * 4, -width * 2, 0],
      [-width * 0.5, 0, width * 0.5],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateX: parallaxOffset }] };
  });

  // Rotation animation for plate image
  const plateRotationStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-width * 4, 0],
      [360, 0],
      Extrapolation.CLAMP
    );
    return { transform: [{ rotate: `${rotation}deg` }] };
  });

  // 1. Hero page with full image layout (like Palmer Coco Green page)
  const HeroPage = () => (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      {/* Background Image */}
      <Image source={{ uri: images[currentImageIndex] }} style={styles.heroBackgroundImage} resizeMode="cover" />
      
      {/* Overlay for better text readability */}
      <View style={styles.heroOverlay} />
      
      {/* Fixed Elan Brand */}
      <Text style={styles.brand}>Elan</Text>
      
      {/* Content Container */}
      <View style={styles.heroContentContainer}>
        {/* Collection Title */}
        <Text style={styles.collectionTitle}>Coco{'\n'}Green</Text>
        
        {/* Description */}
        <Text style={styles.collectionDescription}>
          A fusion of organic design and{'\n'}
          artisanal craftsmanship defines{'\n'}
          this porcelain collection, where{'\n'}
          nature-inspired hues seamlessly{'\n'}
          blend with modern elegance.
        </Text>
        
        {/* Specifications */}
        <View style={styles.heroSpecContainer}>
          <Text style={styles.heroSpecTitle}>Specifications</Text>
          
          <View style={styles.heroSpecRow}>
            <Text style={styles.heroSpecLabel}>Products</Text>
            <Text style={styles.heroSpecValue}>7</Text>
          </View>
          
          <View style={styles.heroSpecRow}>
            <Text style={styles.heroSpecLabel}>Materials</Text>
            <Text style={styles.heroSpecValue}>Porcelain</Text>
          </View>
        </View>
      </View>
      
      {/* Navigation Buttons */}
      <View style={styles.heroNavigation}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      
      {/* Change Image Button */}
      <TouchableOpacity style={styles.changeImageButton} onPress={() => setCurrentImageIndex(prev => prev === 0 ? 1 : 0)}>
        <Text style={styles.changeImageText}>Change View</Text>
      </TouchableOpacity>
    </View>
  );

  // 2. Collection with large plate + description (transparent to show parallax behind)
  const CollectionPage = () => (
    <View style={styles.transparentPage}>
      <View style={styles.collectionLayout}>
        <Image source={{ uri: collectionImage }} style={styles.collectionImg} resizeMode="cover" />
        <View style={styles.collectionDescBox}>
          <Text style={styles.collectionDesc}>In earthy moss green, the intricate patterns created by the reactive glaze ensure each piece is a unique work of art.</Text>
        </View>
      </View>
    </View>
  );

  // 3. Full-screen parallax image (extends behind pages 2 and 4)
  const ParallaxPage = () => (
    <View style={styles.page}>
      <Animated.Image 
        source={{ uri: parallaxImage }} 
        style={[styles.parallaxFullImage, parallaxStyle]} 
        resizeMode="cover" 
      />
    </View>
  );

  // 4. Rotating plate with background (ss14)
  const RotatingPlatePage = () => (
    <View style={styles.page}>
      <Image source={{ uri: backgroundImage }} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.plateCenterWrap}>
        <Animated.Image source={{ uri: plateImage }} style={[styles.plateImg, plateRotationStyle]} resizeMode="contain" />
        <Text style={styles.plateDesc}>The gently speckled surface adds tactile charm, while the high rims and smooth matte finish enhance the collection’s sophisticated, contemporary appeal.</Text>
      </View>
    </View>
  );

  // 5. Products grid layout (like Palmer website)
  const ProductsPage = () => {
    const numColumns = 3; // Changed to 3 columns
    const itemWidth = (width - 80) / numColumns; // Adjusted spacing for 3 columns
    
    // Product rotation based on scroll position
    const productRotationStyle = useAnimatedStyle(() => {
      // Rotate products based on scroll position
      // When scrolled to last page (translateX = -width * 4), products should have rotated
      const rotation = interpolate(
        translateX.value,
        [-width * 4, -width * 3, 0], // From last page to first page
        [360, 180, 0], // Rotate 360 degrees when fully scrolled to last page
        Extrapolation.CLAMP
      );
      return { transform: [{ rotate: `${rotation}deg` }] };
    });
    
    const renderProductItem = ({ item }: { item: typeof products[0] }) => (
      <View style={[styles.productCard, { width: itemWidth }]}>
        <TouchableOpacity style={styles.productTouchable}>
          <View style={[styles.productImageContainer, { height: itemWidth * 0.8 }]}>
            <Animated.Image 
              source={{ uri: item.image }} 
              style={[styles.productImg, { width: itemWidth * 0.7, height: itemWidth * 0.7 }, productRotationStyle]} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );

    const renderHeader = () => (
      <View style={styles.productsHeaderContainer}>
        <Text style={styles.productsTitle}>Products from{'\n'}this collection</Text>
        <Text style={styles.productCount}>{products.length} products</Text>
      </View>
    );

    return (
      <View style={styles.page}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          numColumns={numColumns}
          ListHeaderComponent={renderHeader}
          columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={horizontalSwipe}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <HeroPage />
          <CollectionPage />
          <ParallaxPage />
          <RotatingPlatePage />
          <ProductsPage />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const cardSize = width * 0.5;
const cardMargin = width * 0.06;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: width * 5,
    flex: 1,
  },
  page: {
    width,
    height: "100%",
    backgroundColor: backgroundColor,
  },
  transparentPage: {
    width,
    height: "100%",
    backgroundColor: backgroundColor,
  },
  brand: {
    fontSize: 36,
    color: textColor,
    fontWeight: "bold",
    marginTop: 48,
    marginLeft: 24,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  // Hero page styles
  heroBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(123,135,114,0.4)",
  },
  heroContentContainer: {
    position: "absolute",
    right: 20,
    top: "35%",
    width: width * 0.5,
    zIndex: 5,
    paddingHorizontal: 15,
  },
  collectionTitle: {
    fontSize: 48,
    color: textColor,
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 52,
  },
  collectionDescription: {
    fontSize: 14,
    color: textColor,
    lineHeight: 20,
    marginBottom: 30,
  },
  heroSpecContainer: {
    borderTopWidth: 1,
    borderTopColor: textColor,
    paddingTop: 15,
  },
  heroSpecTitle: {
    fontSize: 16,
    color: textColor,
    fontWeight: "600",
    marginBottom: 15,
  },
  heroSpecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: textColor,
  },
  heroSpecLabel: {
    fontSize: 12,
    color: textColor,
    opacity: 0.8,
  },
  heroSpecValue: {
    fontSize: 12,
    color: textColor,
    fontWeight: "600",
  },
  heroNavigation: {
    position: "absolute",
    bottom: 40,
    left: 40,
    flexDirection: "row",
    gap: 15,
    zIndex: 10,
  },
  navButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: textColor,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(123,135,114,0.1)",
  },
  navButtonText: {
    color: textColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "#5e6a5e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    zIndex: 10,
  },
  changeImageText: {
    color: textColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  heroWrap: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 24,
    paddingTop: 10,
    backgroundColor: backgroundColor,
  },
  heroImagesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 38,
    marginBottom: 24,
  },
  heroImage: {
    width: width * 0.45,
    height: height * 0.3,
    backgroundColor: backgroundColor,
    borderRadius: 16,
    marginRight: 18
  },
  toggleBtn: {
    backgroundColor: "#5e6a5e",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 13,
    justifyContent: "center"
  },
  toggleText: {
    color: "#eceee9",
    fontWeight: "bold",
    fontSize: 16
  },
  productsHeader: {
    fontSize: 34,
    color: textColor,
    fontWeight: "bold",
    marginTop: 42,
    textAlign: "left",
    lineHeight: 40,
  },
  // Collection page
  collectionLayout: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    backgroundColor: backgroundColor, // Semi-transparent background
    zIndex: 2, // Above parallax image
  },
  collectionImg: {
    width: width * 0.43,
    height: height * 0.53,
    borderRadius: 14,
    marginRight: 18,
  },
  collectionDescBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 7,
  },
  collectionDesc: {
    fontSize: 18,
    color: textColor,
    marginBottom: 10,
  },
  // Full-screen parallax image
  parallaxFullImage: {
    position: "absolute",
    width: width * 3, // Make it even wider to ensure coverage
    height: "100%",
    left: -width, // Shift it to cover more area
    zIndex: 0, // Keep it at base level, not negative
  },
  // Rotating plate page
  bgImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  plateCenterWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(123,135,114,0.7)",
    paddingHorizontal: 32
  },
  plateImg: {
    width: width * 0.64,
    height: width * 0.64,
    marginBottom: 34,
    borderRadius: width * 0.32,
    backgroundColor: backgroundColor,
    shadowColor: "#222",
    shadowOffset: { width: 4, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 15,
  },
  plateDesc: {
    fontSize: 16,
    color: textColor,
    textAlign: "center",
    lineHeight: 25,
    marginTop: 15,
    opacity: 0.93,
    paddingHorizontal: 25
  },
  // Products grid layout
  productsHeaderContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  productsTitle: {
    fontSize: 34,
    color: textColor,
    fontWeight: "bold",
    lineHeight: 40,
    marginBottom: 10,
  },
  productCount: {
    fontSize: 16,
    color: textColor,
    opacity: 0.8,
  },
  gridContainer: {
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: backgroundColor,
    // Width is now set dynamically in component
  },
  productTouchable: {
    flex: 1,
  },
  productImageContainer: {
    width: "100%",
    // Height is now set dynamically in component
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: backgroundColor,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#eceee97d",
    shadowColor: "#222",
    shadowOffset: { width: 3, height: 7 },
    shadowOpacity: 0.09,
    shadowRadius: 13,
    marginBottom: 12,
  },
  productImg: {
    borderRadius: 100,
    // Width and height are now set dynamically in component
  },
  productName: {
    color: textColor,
    fontWeight: "bold",
    fontSize: 13, // Slightly smaller for 3 columns
    textAlign: "center",
    paddingHorizontal: 4,
  }
});
