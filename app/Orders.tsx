import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrders } from '../firebase/Hooks/UseOrder';
import { debugOrders, createTestOrder } from '../firebase/service/OrderService';
import { IOrder, OrderStatus } from '../firebase/Types/Order';
import { auth } from '../firebase/firebase';

export default function Orders() {
  const { ordersQuery, cancelOrder, updateStatus } = useOrders();
  const { data: orders = [], isLoading, error } = ordersQuery;

  // Debug effect to check orders and auth
  useEffect(() => {
    const runDebug = async () => {
      console.log('Orders component mounted, running debug...');
      console.log('Auth state:', auth.currentUser ? {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        isAnonymous: auth.currentUser.isAnonymous,
      } : 'No user authenticated');
      
      await debugOrders();
      console.log('Orders query state:', { 
        isLoading, 
        error: error?.message, 
        ordersCount: orders?.length 
      });
    };
    
    runDebug();
  }, [isLoading, error, orders?.length]);

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

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await cancelOrder.mutateAsync(orderId);
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel order');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderOrderItem = ({ item: order }: { item: IOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id?.slice(-8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.orderItemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.itemSpecs}>
                {item.collectionName} • Size: {item.size} • {item.color}
              </Text>
              <Text style={styles.itemPrice}>
                ₹{item.price} × {item.quantity}
              </Text>
            </View>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderSummary}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalAmount}>₹{order.total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.orderActions}>
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(order.id!)}
              disabled={cancelOrder.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.viewButton}
            onPress={async () => {
              try {
                console.log('Navigating to order details with ID:', order.id);
                if (order.id) {
                  // Store the order ID in AsyncStorage so order-details can read it
                  await AsyncStorage.setItem('selectedOrderId', order.id);
                  router.push('/order-details' as any);
                } else {
                  Alert.alert('Error', 'Order ID not found');
                }
              } catch (error) {
                console.error('Navigation error:', error);
                Alert.alert('Error', 'Failed to navigate to order details');
              }
            }}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={{ marginTop: 10, color: '#333' }}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={{ marginTop: 10, color: '#333', fontSize: 16 }}>Error loading orders</Text>
          <Text style={{ marginTop: 5, color: '#666', fontSize: 12, textAlign: 'center' }}>
            {error?.message || 'Unknown error occurred'}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              console.log('Retry button pressed');
              ordersQuery.refetch();
            }} 
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f3" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={() => {
            console.log('Manual refresh triggered');
            ordersQuery.refetch();
          }}
        >
          <Ionicons name="refresh" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
          <Text style={styles.emptyStateText}>
            When you place your first order, it will appear here
          </Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton} 
            onPress={() => router.push('/')}
          >
            <Text style={styles.continueShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
          
          {/* Debug: Test Order Button */}
          <TouchableOpacity 
            style={[styles.continueShoppingButton, { backgroundColor: '#e74c3c', marginTop: 10 }]} 
            onPress={async () => {
              try {
                console.log('Creating test order...');
                const orderId = await createTestOrder();
                Alert.alert('Success', `Test order created: ${orderId}`);
                ordersQuery.refetch();
              } catch (error: any) {
                console.error('Test order creation failed:', error);
                Alert.alert('Error', error.message || 'Failed to create test order');
              }
            }}
          >
            <Text style={styles.continueShoppingText}>Create Test Order (Debug)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemSpecs: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  moreItems: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
