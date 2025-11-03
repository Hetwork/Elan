import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
// import { Redirect } from 'expo-router';

// export default function AdminLayout() {
//   return <Redirect href="/admin/(tabs)/AdminHome" />;
// }
