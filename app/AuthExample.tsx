import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthModal } from '../components/Auth';

const AuthExample: React.FC = () => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handleAuthSuccess = () => {
    console.log('User authenticated successfully!');
    // Handle successful authentication here
    // e.g., navigate to main app, update app state, etc.
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.authButton}
        onPress={() => setIsAuthModalVisible(true)}
      >
        <Text style={styles.authButtonText}>Sign In / Sign Up</Text>
      </TouchableOpacity>

      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </View>
  );
};

export default AuthExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  authButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
