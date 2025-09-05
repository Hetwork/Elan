import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock cart data - replace with your actual cart hook
const mockCartItems = [
  {
    id: 1,
    name: "Bowl ø 9",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e0c3b1aeba6d47db3e90_Bowl%209-1.webp",
    price: 42.00,
    quantity: 2,
    size: "9 cm",
    color: "Green",
    collection: "Coco Green"
  },
  {
    id: 2,
    name: "Deep Plate ø 16",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836e05bf598be5f1ff311d7_Deep%20plate%2016-1.webp",
    price: 58.00,
    quantity: 1,
    size: "16 cm",
    color: "Green",
    collection: "Coco Green"
  },
  {
    id: 3,
    name: "Plate ø 19",
    image: "https://cdn.prod.website-files.com/677b8a552071e1f09b594a24/6836dfe00c3d21f37b42b89b_Plate%2019-2.webp",
    price: 65.00,
    quantity: 3,
    size: "19 cm",
    color: "Green",
    collection: "Coco Green"
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const handleCheckout = (total: number) => {
  const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY;
  if (!razorpayKey) {
    alert('Razorpay key not configured');
    return;
  }

  var options = {
    description: 'Order Payment',
    image: 'assets/icon.png',
    currency: 'INR',
    key: razorpayKey,
    amount: total * 100, // Amount in paise
    name: 'Elan',
    // prefill: {
    //   email: 'info@elan.com',
    //   contact: '+31 541 581 600',

    //   name: 'hackzilla',
    // },
    theme: { color: '#f8f8f3' },
  };
  RazorpayCheckout.open(options)
    .then((data) => {
      // handle success
      alert(`Success: ${data.razorpay_payment_id}`);
    })
    .catch((error) => {
      // handle failure
      alert(`Error: ${error.code} | ${error.description}`);
    });
};

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 21% VAT
  const total = subtotal + tax;

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as typeof mockCartItems
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const renderCartItem = ({ item }: { item: typeof mockCartItems[0] }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCollection}>{item.collection}</Text>
          <Text style={styles.itemSpecs}>Size: {item.size} • Color: {item.color}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Ionicons name="remove" size={14} color="#333" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Ionicons name="add" size={14} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.trashButton} 
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.elanText}>Elan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mainContent}>
        {/* Cart Items */}
        <View style={styles.cartItemsSection}>
          <View style={styles.cartHeader}>
            <Text style={styles.cartTitle}>Shopping Cart</Text>
            <Text style={styles.itemCount}>{cartItems.length} items</Text>
          </View>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="bag-outline" size={80} color="#ccc" />
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
              <Text style={styles.emptyCartSubtext}>Add some beautiful pieces to get started</Text>
            </View>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cartList}
            />
          )}
        </View>

        {/* Order Summary */}
        {cartItems.length > 0 && (
            <View style={styles.summarySection}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (18%)</Text>
              <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.payButton, cartItems.length === 0 && styles.payButtonDisabled]}
              disabled={cartItems.length === 0}
              onPress={() => handleCheckout(total)}
            >
              <Text style={styles.payButtonText}>
                {cartItems.length === 0 ? 'Cart Empty' : 'Proceed to Payment'}
              </Text>
              {cartItems.length > 0 && (
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.payButtonIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.continueShoppingButton} onPress={() => router.back()}>
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  elanText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerSpacer: { width: 40 },

  mainContent: { flex: 1, flexDirection: 'column' },

  // Cart Items
  cartItemsSection: { flex: 1, paddingHorizontal: 20, paddingVertical: 10 },
  cartHeader: { marginBottom: 20 },
  cartTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  itemCount: { fontSize: 16, color: '#666' },
  cartList: { paddingBottom: 20 },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 16 },
  itemDetails: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  itemCollection: { fontSize: 13, color: '#666', marginBottom: 6 },
  itemSpecs: { fontSize: 12, color: '#999' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  trashButton: { marginLeft: 10 },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  quantityText: { fontSize: 15, fontWeight: '600', marginHorizontal: 8 },

  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyCartText: { fontSize: 20, fontWeight: '600', color: '#333', marginTop: 20, marginBottom: 8 },
  emptyCartSubtext: { fontSize: 16, color: '#666', textAlign: 'center' },

  // Summary Section
  summarySection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContainer: { padding: 20 },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  summaryLabel: { fontSize: 15, color: '#666' },
  summaryValue: { fontSize: 15, fontWeight: '500', color: '#333' },
  totalRow: { borderBottomWidth: 2, borderBottomColor: '#333', marginBottom: 20, paddingBottom: 12 },
  totalLabel: { fontSize: 17, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },

  payButton: {
    backgroundColor: '#333', paddingVertical: 14, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  payButtonDisabled: { backgroundColor: '#ccc' },
  payButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  payButtonIcon: { marginLeft: 6 },

  continueShoppingButton: { paddingVertical: 12, alignItems: 'center' },
  continueShoppingText: { color: '#666', fontSize: 14, fontWeight: '500' },
});
