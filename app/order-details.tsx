import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrder } from '../firebase/Hooks/UseOrder';
import { createTestOrder } from '../firebase/service/OrderService';
import { OrderStatus } from '../firebase/Types/Order';
import { auth } from '../firebase/firebase';

export default function OrderDetails() {
  const { id: urlId } = useLocalSearchParams<{ id: string }>();
  const [orderId, setOrderId] = useState<string>('');
  const { data: order, isLoading, error } = useOrder(orderId);

  // Load order ID from AsyncStorage or URL params
  useEffect(() => {
    const loadOrderId = async () => {
      try {
        // First try to get from URL params
        if (urlId) {
          console.log('OrderDetails: Using URL ID:', urlId);
          setOrderId(urlId);
          return;
        }

        // Then try to get from AsyncStorage
        const storedOrderId = await AsyncStorage.getItem('selectedOrderId');
        console.log('OrderDetails: Stored order ID:', storedOrderId);
        
        if (storedOrderId) {
          setOrderId(storedOrderId);
          // Clear it after use
          await AsyncStorage.removeItem('selectedOrderId');
        } else {
          console.log('OrderDetails: No order ID found');
          Alert.alert('Error', 'No order ID provided');
        }
      } catch (error) {
        console.error('OrderDetails: Error loading order ID:', error);
        Alert.alert('Error', 'Failed to load order ID');
      }
    };

    loadOrderId();
  }, [urlId]);

  // Debug effect
  useEffect(() => {
    console.log('OrderDetails state:', {
      urlId,
      orderId,
      isLoading,
      hasOrder: !!order,
      error: error?.message,
    });
    
    if (order) {
      console.log('Order data loaded:', {
        id: order.id,
        status: order.status,
        total: order.total,
        itemsCount: order.items?.length,
      });
    }
  }, [urlId, orderId, isLoading, error, order]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'confirmed':
        return '#3498db';
      case 'processing':
        return '#9b59b6';
      case 'shipped':
        return '#e67e22';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  if (isLoading || !orderId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={{ marginTop: 10, color: '#333' }}>
            {!orderId ? 'Loading order ID...' : 'Loading order details...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={{ marginTop: 10, color: '#333', fontSize: 16 }}>Order not found</Text>
          <Text style={{ marginTop: 5, color: '#666', fontSize: 12, textAlign: 'center' }}>
            {error?.message || 'The requested order could not be loaded'}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToOrdersButton}>
            <Text style={styles.backToOrdersText}>Back to Orders</Text>
          </TouchableOpacity>
          
          {/* Debug: Create test order and retry */}
          <TouchableOpacity 
            style={[styles.backToOrdersButton, { backgroundColor: '#e74c3c', marginTop: 10 }]} 
            onPress={async () => {
              try {
                console.log('Creating test order from order details...');
                const newOrderId = await createTestOrder();
                Alert.alert('Success', `Test order created: ${newOrderId}`, [
                  {
                    text: 'View Order',
                    onPress: () => {
                      setOrderId(newOrderId);
                    },
                  },
                  {
                    text: 'Back to Orders',
                    onPress: () => router.back(),
                  },
                ]);
              } catch (error: any) {
                console.error('Test order creation failed:', error);
                Alert.alert('Error', error.message || 'Failed to create test order');
              }
            }}
          >
            <Text style={styles.backToOrdersText}>Create Test Order (Debug)</Text>
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order #{order.id?.slice(-8).toUpperCase()}</Text>
              <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
          {order.items?.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/80' }} 
                style={styles.itemImage} 
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.productName || 'Unknown Product'}</Text>
                <Text style={styles.itemCollection}>{item.collectionName || 'Unknown Collection'}</Text>
                <Text style={styles.itemSpecs}>
                  Size: {item.size || 'N/A'} • Color: {item.color || 'N/A'}
                </Text>
                <View style={styles.itemPricing}>
                  <Text style={styles.itemPrice}>₹{(item.price || 0)} × {item.quantity || 1}</Text>
                  <Text style={styles.itemTotal}>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )) || <Text style={{ color: '#666', fontStyle: 'italic' }}>No items found</Text>}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.customerName}>{order.userName || 'Unknown Customer'}</Text>
            <Text style={styles.addressText}>{order.address?.street || 'Address not available'}</Text>
            <Text style={styles.addressText}>
              {order.address?.city || 'City'}, {order.address?.state || 'State'} {order.address?.zipCode || 'ZIP'}
            </Text>
            <Text style={styles.addressText}>{order.address?.country || 'Country'}</Text>
            <Text style={styles.contactInfo}>📞 {order.userPhoneNumber || 'Phone not available'}</Text>
            <Text style={styles.contactInfo}>✉️ {order.userEmail || 'Email not available'}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Text style={styles.paymentValue}>
                {(order.paymentMethod || 'unknown').toUpperCase()}
              </Text>
            </View>
            {order.paymentId && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment ID</Text>
                <Text style={styles.paymentValue}>{order.paymentId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{(order.subtotal || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (18%)</Text>
              <Text style={styles.summaryValue}>₹{(order.tax || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{(order.total || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemCollection: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemSpecs: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    marginBottom: 0,
    paddingBottom: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backToOrdersButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  backToOrdersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
