import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  CartItem,
} from "../service/CartService";
import Toast from "react-native-toast-message";

/**
 * Hook to interact with cart using TanStack Query
 */
export const useCart = () => {
  const queryClient = useQueryClient();

  // 🔹 Fetch cart items
  const cartQuery = useQuery<CartItem[]>({
    queryKey: ["cartItems"],
    queryFn: async () => {
      console.log('UseCart: Fetching cart items');
      const items = await getCartItemsByCartId();
      console.log('UseCart: Fetched items:', items);
      return items;
    },
  });

  // 🔹 Add item to cart
  const addItem = useMutation({
    mutationFn: async (item: CartItem) => {
      console.log('UseCart: Adding item:', item);
      const result = await createCartItem(item);
      console.log('UseCart: Item added successfully:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      console.log('UseCart: Invalidating cart queries');
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Added to Cart!',
        text2: `${variables.productName} has been added to your cart`,
        visibilityTime: 3000,
        topOffset: 60,
      });
    },
    onError: (error) => {
      console.error('UseCart: Error adding item:', error);
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add item to cart. Please try again.',
        visibilityTime: 3000,
        topOffset: 60,
      });
    },
  });

  // 🔹 Update item in cart
  const updateItem = useMutation({
    mutationFn: ({
      productId,
      updates,
    }: {
      productId: string;
      updates: Partial<CartItem>;
    }) => updateCartItem(productId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      
      // Show success toast for quantity update
    //   if (variables.updates.quantity) {
    //     Toast.show({
    //       type: 'info',
    //       text1: 'Cart Updated',
    //       text2: `Quantity updated to ${variables.updates.quantity}`,
    //       visibilityTime: 2000,
    //       topOffset: 60,
    //     });
    //   }
    },
  });

  // 🔹 Delete item from cart
  const deleteItem = useMutation({
    mutationFn: (productId: string) => deleteCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      
      // Show success toast for item removal
      Toast.show({
        type: 'success',
        text1: 'Item Removed',
        text2: 'Item has been removed from your cart',
        visibilityTime: 2000,
        topOffset: 60,
      });
    },
  });

  return { cartQuery, addItem, updateItem, deleteItem };
};
