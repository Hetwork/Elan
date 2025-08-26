import { router, Stack } from 'expo-router';

import { StyleSheet, TouchableOpacity, View,Text } from 'react-native';


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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,

  },
});
