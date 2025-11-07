import '../global.css';

import { Stack } from 'expo-router';
import QueryProvider from '../firebase/providers/QueryProvider';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'Home',
// };

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase after component mounts
    import('../firebase/firebase');
  }, []);

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="horizontal" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="detail" options={{ headerShown: false }} />
        <Stack.Screen name="miami-products" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="Cart" options={{ headerShown: false }} />
        <Stack.Screen name="About" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="Orders" options={{ headerShown: false }} />
        <Stack.Screen name="order-details" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </QueryProvider>
  );
}
