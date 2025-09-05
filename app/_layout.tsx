import '../global.css';

import { Stack } from 'expo-router';
import QueryProvider from '../firebase/providers/QueryProvider';
import { useEffect } from 'react';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize Firebase after component mounts
    import('../firebase/firebase');
  }, []);

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="gridview" options={{ headerShown: false }} />
        <Stack.Screen name="horizontal" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="detail" options={{ headerShown: false }} />
        <Stack.Screen name="miami-products" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="Cart" options={{ headerShown: false }} />
        <Stack.Screen name="About" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryProvider>
  );
}
