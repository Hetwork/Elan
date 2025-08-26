import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function DetailScreen() {
  const { id, photo, name } = useLocalSearchParams<{ 
    id: string; 
    photo: string; 
    name: string; 
  }>();
  const router = useRouter();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 90 }));
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedValue.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      animatedValue.value,
      [0, 1],
      [30, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <AntDesign name="arrowleft" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={styles.imageContainer}>
        <Animated.Image 
          source={{ uri: photo }} 
          style={styles.image}
          sharedTransitionTag={`image-${id}`}
        />
      </View>
      
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>
          Beautiful ceramic piece from our premium collection. 
          Crafted with attention to detail and designed for modern living.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: 300, 
    height: 300, 
    borderRadius: 20,
  },
  contentContainer: {
    flex: 0.4,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
});
