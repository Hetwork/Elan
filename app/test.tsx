import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

import Animated from 'react-native-reanimated';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/400' }}
        style={styles.homeImage}
        sharedTransitionTag="sharedImage"
        resizeMode="cover"
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Animated.Image
        source={{ uri: 'https://picsum.photos/id/39/400' }}
        style={styles.detailImage}
        sharedTransitionTag="sharedImage"
        resizeMode="cover"
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  homeImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
  },
  detailImage: {
    width: 100,
    height: 100,
    borderRadius: 55,
  },
});