import { router, Stack } from 'expo-router';

import { StyleSheet, TouchableOpacity, View,Text } from 'react-native';
import { uploadProducts } from '~/json/productupload';


export default function Home() {
  

  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#ccc', borderRadius: 5 }} onPress={() => router.push('/Home')}>
          <Text>Open Image Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#ccc', borderRadius: 5 }} onPress={() => router.push('/gridview')}>
          <Text>Open Grid Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#ccc', borderRadius: 5 }} onPress={() => router.push('/horizontal')}>
          <Text>Scroll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#ccc', borderRadius: 5 }} onPress={() => router.push('/test')}>
          <Text>Open Test Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#007AFF', borderRadius: 5 }} onPress={() => router.push('/miami-products')}>
          <Text style={{ color: 'white' }}>Miami Products Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 20, backgroundColor: '#007AFF', borderRadius: 5 }} onPress={() => uploadProducts()}>
          <Text style={{ color: 'white' }}>Products Upload</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 10,
  },
});
