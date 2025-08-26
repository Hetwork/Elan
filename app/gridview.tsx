import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { AntDesign, Fontisto, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Product collections data based on the reference images
const collections = [
  {
    id: 1,
    name: 'Antigo Blue',
    productCount: '4 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d970cf3163f9824c3a12c2_Midori%20Plate%2023%2C5.webp',
  },
  {
    id: 2,
    name: 'Jory',
    productCount: '5 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d9707eab0def13c185226a_Miami%20Saucer%2014.webp',
  },
  {
    id: 3,
    name: 'Miami',
    productCount: '11 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96efac6037c23fa15d6c4_Light%20Blue%20Sea%20Bowl%2016.webp',
  },
  {
    id: 4,
    name: 'Ruston',
    productCount: '8 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d971124ae04d418efb01c7_Ruston%20Plate%2027.webp',
  },
  {
    id: 5,
    name: 'Barolo',
    productCount: '6 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96d19cd7ab59d28b45037_Barolo%20Plate%2028.webp',
  },
  {
    id: 6,
    name: 'Kiryu',
    productCount: '9 Products',
    image: 'https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/67d96ebd7bed792e812eca91_Kiryu%20Plate%2023%2C5.webp',
  },
];

export default function GridView() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const renderHeader = () => (
    <>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Explore Elan{'\n'}dinnerware collections</Text>
        <Text style={styles.subtitle}>
          Our collection is designed to engage all of the{'\n'}
          senses. Rich colors and beautifully textured finishes{'\n'}
          transform every meal into a dish worth celebrating.
        </Text>
      </View>
    </>
  );

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCount}>{item.productCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <FlatList
        data={collections}
        renderItem={renderProductCard}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Fixed Header - Floating */}
      <View style={styles.headerFloating}>
        <Text style={styles.brandText}>Elan</Text>
        <TouchableOpacity style={styles.gridViewButton}>
          <Fontisto name="nav-icon-grid-a" size={16} color="black" />
          <Text style={styles.gridViewText}>grid view</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Menu Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <AntDesign name="menu-fold" size={18} color="white" />
          <Text style={styles.menuButtonText}>menu</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      {isMenuVisible && (
        <View style={styles.menuModal}>
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                // Navigate to collections
              }}>
              <View style={styles.menuDot} />
              <Text style={styles.menuItemText}>Collections</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                // Navigate to about
              }}>
              <Text style={[styles.menuItemText, styles.menuItemTextIndent]}>About</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItemView}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                // Navigate to contact
              }}>
              <Text style={[styles.menuItemText, styles.menuItemTextIndent]}>Contact</Text>
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
    backgroundColor: '#f5f6ee',
  },
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 100, // Add padding to account for fixed header
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
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
    backgroundColor: 'rgba(245, 246, 238, 0)',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#393939',
    fontFamily: 'System',
  },
  gridViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ababa6',
  },
  gridViewText: {
    fontSize: 14,
    color: '#393939',
    marginLeft: 8,
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
  productImage: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
    resizeMode: 'cover',
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
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 0,
    alignItems: "flex-start",
    zIndex: 1000,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  menuModal: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    minWidth: 150,
    zIndex: 2000,
  },
  menuItemView: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
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