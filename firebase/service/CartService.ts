import { db, auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cartId';

export type CartItem = {
  id?: string; // Firestore doc id
  productId: string;
  productName: string;
  image: string;
  size: string | number;
  color: string;
  collectionName: string;
  quantity: number;
  price: number;
  createdAt?: Date;
};

/**
 * 🔹 Get or create the cartId (local first, then Firestore if logged in)
 */
export const getOrCreateCartId = async (): Promise<string> => {
  // 1. Check AsyncStorage first
  let cartId = await AsyncStorage.getItem(CART_KEY);
  const user = auth.currentUser;

  if (cartId) return cartId;

  if (user) {
    // 2. If logged in, check Firestore user doc
    const userRef = db.collection('users').doc(user.uid);
    const userSnap = await userRef.get();

    if (userSnap.exists && userSnap.data()?.cartId) {
      const existingCartId = userSnap.data()!.cartId as string;
      await AsyncStorage.setItem(CART_KEY, existingCartId);
      return existingCartId;
    }

    // 3. Otherwise, create new cart doc
    const cartRef = db.collection('carts').doc();
    await cartRef.set({
      userId: user.uid,
      items: [],
      createdAt: new Date(),
    });

    const newCartId = cartRef.id;

    // Save in user doc
    await userRef.update({ cartId: newCartId });

    // Save locally
    await AsyncStorage.setItem(CART_KEY, newCartId);

    return newCartId;
  }

  // 4. If not logged in, create local-only cartId
  const cartRef = db.collection('carts').doc();
  const newCartId = cartRef.id;
  await cartRef.set({ userId: null, items: [], createdAt: new Date() });

  await AsyncStorage.setItem(CART_KEY, newCartId);
  return newCartId;
};

/**
 * 🔹 Get all cart items by cartId
 */
export const getCartItemsByCartId = async (): Promise<CartItem[]> => {
  try {
    const cartId = await getOrCreateCartId();
    console.log('Getting cart items for cartId:', cartId);
    
    const cartRef = db.collection('carts').doc(cartId);
    const cartSnap = await cartRef.get();

    if (!cartSnap.exists) {
      console.log('Cart document does not exist');
      return [];
    }
    
    const items = cartSnap.data()?.items || [];
    console.log('Cart items found:', items);
    return items;
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

/**
 * 🔹 Add new cart item
 */
export const createCartItem = async (item: CartItem) => {
  try {
    const cartId = await getOrCreateCartId();
    const cartRef = db.collection('carts').doc(cartId);
    const cartSnap = await cartRef.get();

    let items = [];
    
    if (cartSnap.exists) {
      items = cartSnap.data()?.items || [];
    } else {
      // If cart doesn't exist, create it first
      await cartRef.set({
        userId: auth.currentUser?.uid || null,
        items: [],
        createdAt: new Date(),
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = items.findIndex((existingItem: CartItem) => 
      existingItem.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // If item exists, update quantity
      items[existingItemIndex].quantity += item.quantity;
    } else {
      // If item doesn't exist, add new item
      const newItem = { ...item, createdAt: new Date() };
      items.push(newItem);
    }

    await cartRef.update({
      items: items,
    });

    console.log('Cart item created/updated successfully');
    return item;
  } catch (error) {
    console.error('Error in createCartItem:', error);
    throw error;
  }
};

/**
 * 🔹 Update cart item (by productId)
 */
export const updateCartItem = async (productId: string, updates: Partial<CartItem>) => {
  const cartId = await getOrCreateCartId();
  const cartRef = db.collection('carts').doc(cartId);
  const cartSnap = await cartRef.get();

  if (!cartSnap.exists) return;

  const items: CartItem[] = cartSnap.data()?.items || [];
  const updatedItems = items.map((it) => (it.productId === productId ? { ...it, ...updates } : it));

  await cartRef.update({ items: updatedItems });
};

/**
 * 🔹 Delete cart item (by productId)
 */
export const deleteCartItem = async (productId: string) => {
  const cartId = await getOrCreateCartId();
  const cartRef = db.collection('carts').doc(cartId);
  const cartSnap = await cartRef.get();

  if (!cartSnap.exists) return;

  const items: CartItem[] = cartSnap.data()?.items || [];
  const filteredItems = items.filter((it) => it.productId !== productId);

  await cartRef.update({ items: filteredItems });
};
