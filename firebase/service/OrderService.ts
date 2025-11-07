import { db, auth } from '../firebase';
import { IOrder, CreateOrderData, OrderStatus } from '../Types/Order';

/**
 * 🔹 Create a new order
 */
export const createOrder = async (orderData: CreateOrderData): Promise<string> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const orderRef = db.collection('orders').doc();
  
  const order: IOrder = {
    ...orderData,
    id: orderRef.id,
    userId: user.uid,
    createdAt: new Date(),
    status: 'pending',
    updatedAt: new Date(),
  };

  await orderRef.set(order);
  return orderRef.id;
};

/**
 * 🔹 Get all orders for current user (alternative without orderBy)
 */
export const getUserOrdersSimple = async (): Promise<IOrder[]> => {
  const user = auth.currentUser;
  
  if (!user) {
    console.log('User not authenticated');
    throw new Error('User not authenticated');
  }

  console.log('Getting orders for user (simple):', user.uid);

  try {
    const ordersSnapshot = await db
      .collection('orders')
      .where('userId', '==', user.uid)
      .get();

    console.log('Orders found (simple):', ordersSnapshot.size);

    const orders = ordersSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      console.log('Order data (simple):', data);
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : undefined,
      };
    }) as IOrder[];

    // Sort by createdAt in memory since we can't use orderBy
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting orders (simple):', error);
    throw error;
  }
};

/**
 * 🔹 Get all orders for current user
 */
export const getUserOrders = async (): Promise<IOrder[]> => {
  // First try the simple version to avoid composite index issues
  try {
    return await getUserOrdersSimple();
  } catch (error) {
    console.log('Simple query failed, trying with orderBy:', error);
    
    // Fallback to original query with orderBy
    const user = auth.currentUser;
    
    if (!user) {
      console.log('User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('Getting orders for user:', user.uid);

    try {
      const ordersSnapshot = await db
        .collection('orders')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      console.log('Orders found:', ordersSnapshot.size);

      return ordersSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        console.log('Order data:', data);
        
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : undefined,
        };
      }) as IOrder[];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }
};

/**
 * 🔹 Get a specific order by ID
 */
export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  const user = auth.currentUser;
  
  console.log('getOrderById called with:', orderId);
  
  if (!user) {
    console.log('getOrderById: User not authenticated');
    throw new Error('User not authenticated');
  }

  if (!orderId) {
    console.log('getOrderById: No order ID provided');
    throw new Error('No order ID provided');
  }

  try {
    console.log('getOrderById: Fetching order from Firestore...');
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    console.log('getOrderById: Order document exists:', orderDoc.exists);
    
    if (!orderDoc.exists) {
      console.log('getOrderById: Order not found');
      return null;
    }

    const orderData = orderDoc.data();
    console.log('getOrderById: Order data retrieved:', {
      userId: orderData?.userId,
      status: orderData?.status,
      total: orderData?.total,
      currentUserId: user.uid,
    });
    
    // Verify the order belongs to the current user
    if (orderData?.userId !== user.uid) {
      console.log('getOrderById: Unauthorized access - order belongs to different user');
      throw new Error('Unauthorized access to order');
    }

    const order = {
      id: orderDoc.id,
      ...orderData,
      createdAt: orderData?.createdAt?.toDate ? orderData.createdAt.toDate() : new Date(orderData?.createdAt),
      updatedAt: orderData?.updatedAt?.toDate ? orderData.updatedAt.toDate() : orderData?.updatedAt ? new Date(orderData.updatedAt) : undefined,
    } as IOrder;

    console.log('getOrderById: Order processed successfully');
    return order;
  } catch (error) {
    console.error('getOrderById: Error fetching order:', error);
    throw error;
  }
};

/**
 * 🔹 Update order status (admin only or specific status updates)
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();
  
  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data();
  
  // Verify the order belongs to the current user for certain status updates
  if (orderData?.userId !== user.uid && status !== 'cancelled') {
    // Only users can cancel their own orders, other status updates might be admin-only
    throw new Error('Unauthorized to update order status');
  }

  await orderRef.update({
    status,
    updatedAt: new Date(),
  });
};

/**
 * 🔹 Cancel an order (user can only cancel pending/confirmed orders)
 */
export const cancelOrder = async (orderId: string): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();
  
  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data();
  
  if (orderData?.userId !== user.uid) {
    throw new Error('Unauthorized to cancel this order');
  }

  if (!['pending', 'confirmed'].includes(orderData?.status)) {
    throw new Error('Order cannot be cancelled at this stage');
  }

  await orderRef.update({
    status: 'cancelled',
    updatedAt: new Date(),
  });
};

/**
 * 🔹 Create a test order for debugging
 */
export const createTestOrder = async (): Promise<string> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const orderRef = db.collection('orders').doc();
  
  const testOrder: IOrder = {
    id: orderRef.id,
    userId: user.uid,
    createdAt: new Date(),
    status: 'pending',
    items: [
      {
        productId: 'test-product-1',
        productName: 'Test Product',
        image: 'https://via.placeholder.com/150',
        size: 'M',
        color: 'Blue',
        collectionName: 'Test Collection',
        quantity: 1,
        price: 999.99,
      }
    ],
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '123456',
      country: 'India',
    },
    paymentMethod: 'razorpay',
    userName: 'Test User',
    userPhoneNumber: '+91 9999999999',
    userEmail: 'test@example.com',
    subtotal: 999.99,
    tax: 179.99,
    total: 1179.98,
    updatedAt: new Date(),
  };

  console.log('Creating test order:', testOrder);
  await orderRef.set(testOrder);
  console.log('Test order created with ID:', orderRef.id);
  return orderRef.id;
};

/**
 * 🔹 Debug function to check orders collection
 */
export const debugOrders = async (): Promise<void> => {
  const user = auth.currentUser;
  console.log('=== DEBUG ORDERS ===');
  console.log('Current user:', user?.uid);
  
  if (!user) {
    console.log('No authenticated user');
    return;
  }

  try {
    // Check if orders collection exists and has any documents
    const allOrdersSnapshot = await db.collection('orders').limit(5).get();
    console.log('Total orders in collection:', allOrdersSnapshot.size);
    
    if (allOrdersSnapshot.size > 0) {
      console.log('Sample orders:');
      allOrdersSnapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        console.log(`Order ${doc.id}: userId=${data.userId}, createdAt=${data.createdAt}`);
      });
    }

    // Check user-specific orders
    const userOrdersSnapshot = await db
      .collection('orders')
      .where('userId', '==', user.uid)
      .get();
    
    console.log(`Orders for user ${user.uid}:`, userOrdersSnapshot.size);
    
  } catch (error) {
    console.error('Debug orders error:', error);
  }
  console.log('=== END DEBUG ===');
};

/**
 * 🔹 Update payment information for an order
 */
export const updateOrderPayment = async (orderId: string, paymentId: string): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();
  
  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  const orderData = orderDoc.data();
  
  if (orderData?.userId !== user.uid) {
    throw new Error('Unauthorized to update this order');
  }

  await orderRef.update({
    paymentId,
    status: 'confirmed', // Update status to confirmed after successful payment
    updatedAt: new Date(),
  });
};
