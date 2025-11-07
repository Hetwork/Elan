import React from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';
import { router } from 'expo-router';
import { useCart } from '../firebase/Hooks/UseCart';
import { useCreateOrderFromCart } from '../firebase/Hooks/UseOrder';
import { useCurrentUserData, useCreateTestUser } from '../firebase/Hooks/UseAuth';
import { UserService } from '../firebase/service/UserService';
import { CartItem } from '../firebase/service/CartService';

const { width } = Dimensions.get('window');

export default function Cart() {
  // Use the actual cart hook instead of mock data
  const { cartQuery, updateItem, deleteItem } = useCart();
  const { data: cartItems = [], isLoading, error } = cartQuery;
  
  // Get current user data
  const { data: userData, isLoading: userLoading, error: userError } = useCurrentUserData();
  
  // Order creation hook
  const createOrderFromCart = useCreateOrderFromCart();
  
  // Test user creation hook
  const createTestUser = useCreateTestUser();

  // Debug user data
  React.useEffect(() => {
    console.log('Cart - User data:', userData ? {
      hasFirstName: !!userData.firstName,
      hasEmail: !!userData.email,
      hasPhone: !!userData.phoneNumber,
      hasAddress: !!userData.address,
      addressComplete: !!(userData.address?.street && userData.address?.city && userData.address?.state && userData.address?.zipCode && userData.address?.country),
    } : 'No user data');
  }, [userData]);

  const handleCheckout = async (total: number) => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    // Check if user data is loaded
    if (userLoading) {
      Alert.alert('Please Wait', 'Loading user information...');
      return;
    }

    // Check if user data exists
    if (!userData) {
      Alert.alert(
        'Profile Incomplete', 
        'Please complete your profile before placing an order',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Profile', onPress: () => router.push('/profile' as any) }
        ]
      );
      return;
    }

    // Check if user has address
    if (!userData.address || 
        !userData.address.street || 
        !userData.address.city || 
        !userData.address.state || 
        !userData.address.zipCode || 
        !userData.address.country) {
      Alert.alert(
        'Address Required', 
        'Please add your delivery address before placing an order',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Address', onPress: () => router.push('/profile' as any) }
        ]
      );
      return;
    }

    // Check if user has required info
    if (!userData.firstName || !userData.email || !userData.phoneNumber) {
      Alert.alert(
        'Profile Incomplete', 
        'Please complete your profile information (name, email, phone) before placing an order',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete Profile', onPress: () => router.push('/profile' as any) }
        ]
      );
      return;
    }

    const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY;
    if (!razorpayKey) {
      Alert.alert('Error', 'Razorpay key not configured');
      return;
    }

    // Use real user data instead of hardcoded values
    const userDetails = {
      name: `${userData.firstName} ${userData.lastName || ''}`.trim(),
      email: userData.email,
      phone: userData.phoneNumber,
      address: {
        street: userData.address.street,
        city: userData.address.city,
        state: userData.address.state,
        zipCode: userData.address.zipCode,
        country: userData.address.country,
      },
    };

    const options = {
      description: 'Order Payment',
      image: 'assets/icon.png',
      currency: 'INR',
      key: razorpayKey,
      amount: total * 100, // Amount in paise
      name: 'Elan',
      theme: { color: '#f8f8f3' },
    };

    try {
      const paymentResult = await RazorpayCheckout.open(options);
      
      // Create order after successful payment
      await createOrderFromCart.mutateAsync({
        cartItems,
        userDetails,
        paymentMethod: 'razorpay',
        paymentId: paymentResult.razorpay_payment_id,
      });

      Alert.alert(
        'Success!', 
        `Payment successful! Order created with payment ID: ${paymentResult.razorpay_payment_id}`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]
      );
    } catch (error: any) {
      if (error.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment');
      } else {
        Alert.alert('Error', `Payment failed: ${error.description || error.message}`);
        console.error('Payment/Order error:', error);
      }
    }
  };
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const updateQuantity = async (productId: string, change: number) => {
    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem) return;

    const newQuantity = Math.max(0, currentItem.quantity + change);
    
    if (newQuantity === 0) {
      await deleteItem.mutateAsync(productId);
    } else {
      await updateItem.mutateAsync({
        productId,
        updates: { quantity: newQuantity }
      });
    }
  };

  const removeItem = async (productId: string) => {
    await deleteItem.mutateAsync(productId);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemName}>{item.productName}</Text>
          <Text style={styles.itemCollection}>{item.collectionName}</Text>
          {item.collectionName === item.productName ? (
            <Text style={styles.itemSpecs}>Items: {item.size}</Text>
          ):(

          <Text style={styles.itemSpecs}>Size: {item.size} • Color: {item.color}</Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(item.productId, -1)}
            >
              <Ionicons name="remove" size={14} color="#333" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => updateQuantity(item.productId, 1)}
            >
              <Ionicons name="add" size={14} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.trashButton} 
            onPress={() => removeItem(item.productId)}
          >
            <Ionicons name="trash-outline" size={18} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Show loading state
  if (isLoading || userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={{ marginTop: 10, color: '#333' }}>
            {isLoading ? 'Loading cart...' : 'Loading user data...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || userError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={{ marginTop: 10, color: '#333', fontSize: 16 }}>
            {error ? 'Error loading cart' : 'Error loading user data'}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              if (error) cartQuery.refetch();
              // Note: You might want to add a refetch for user data as well
            }} 
            style={styles.continueShoppingButton}
          >
            <Text style={styles.continueShoppingText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              keyExtractor={(item) => item.productId || item.id || Math.random().toString()}
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
            
            {/* Debug: Create test user data */}
            {!userData && (
              <TouchableOpacity 
                style={[styles.continueShoppingButton, { backgroundColor: '#e74c3c', marginTop: 10 }]} 
                onPress={async () => {
                  try {
                    console.log('Creating test user data...');
                    await createTestUser.mutateAsync();
                    Alert.alert('Success', 'Test user data created successfully!');
                  } catch (error: any) {
                    console.error('Test user creation failed:', error);
                    Alert.alert('Error', error.message || 'Failed to create test user data');
                  }
                }}
                disabled={createTestUser.isPending}
              >
                <Text style={[styles.continueShoppingText, { color: 'white' }]}>
                  {createTestUser.isPending ? 'Creating...' : 'Create Test User Data (Debug)'}
                </Text>
              </TouchableOpacity>
            )}
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
