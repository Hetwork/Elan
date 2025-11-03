import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder,
  updateOrderPayment 
} from '../service/OrderService';
import { CreateOrderData, OrderStatus, IOrder } from '../Types/Order';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Get all user orders
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      console.log('useOrders: Running getUserOrders query...');
      try {
        const orders = await getUserOrders();
        console.log('useOrders: Query successful, orders count:', orders.length);
        return orders;
      } catch (error) {
        console.error('useOrders: Query failed:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create new order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderData) => createOrder(orderData),
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to cancel order:', error);
    },
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({ orderId, paymentId }: { orderId: string; paymentId: string }) => 
      updateOrderPayment(orderId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Failed to update payment:', error);
    },
  });

  return {
    ordersQuery,
    createOrder: createOrderMutation,
    updateStatus: updateStatusMutation,
    cancelOrder: cancelOrderMutation,
    updatePayment: updatePaymentMutation,
  };
};

// Hook to get a specific order by ID
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      console.log('useOrder: Fetching order with ID:', orderId);
      if (!orderId) {
        console.log('useOrder: No order ID provided');
        throw new Error('No order ID provided');
      }
      
      try {
        const order = await getOrderById(orderId);
        console.log('useOrder: Order fetched successfully:', order ? {
          id: order.id,
          status: order.status,
          total: order.total,
        } : 'null');
        return order;
      } catch (error) {
        console.error('useOrder: Failed to fetch order:', error);
        throw error;
      }
    },
    enabled: !!orderId, // Only run query if orderId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Custom hook for order creation with cart integration
export const useCreateOrderFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      cartItems: any[]; // CartItem[]
      userDetails: {
        name: string;
        email: string;
        phone: string;
        address: {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
        };
      };
      paymentMethod: 'razorpay' | 'card' | 'upi' | 'netbanking' | 'wallet';
      paymentId?: string;
    }) => {
      const { cartItems, userDetails, paymentMethod, paymentId } = params;
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18; // 18% tax
      const total = subtotal + tax;

      // Convert cart items to order items
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        size: item.size,
        color: item.color,
        collectionName: item.collectionName,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData: CreateOrderData = {
        items: orderItems,
        address: userDetails.address,
        paymentMethod,
        userName: userDetails.name,
        userPhoneNumber: userDetails.phone,
        userEmail: userDetails.email,
        subtotal,
        tax,
        total,
        paymentId,
      };

      return await createOrder(orderData);
    },
    onSuccess: () => {
      // Invalidate orders cache
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Optionally clear cart cache
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to create order from cart:', error);
    },
  });
};
