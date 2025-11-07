export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  size: string | number;
  color: string;
  collectionName: string;
  quantity: number;
  price: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'razorpay' | 'card' | 'upi' | 'netbanking' | 'wallet';

export interface IOrder {
  id?: string; // Firestore doc id
  items: OrderItem[];
  userId: string;
  createdAt: Date;
  status: OrderStatus;
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  userName: string;
  userPhoneNumber: string;
  userEmail: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentId?: string; // Razorpay payment id
  updatedAt?: Date;
}

export interface CreateOrderData {
  items: OrderItem[];
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  userName: string;
  userPhoneNumber: string;
  userEmail: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentId?: string;
}
