import { Redirect } from 'expo-router';

export default function Index() {
  // Whenever someone opens `/`, send them to `/Home`
  return <Redirect href="/Home" />;
}
