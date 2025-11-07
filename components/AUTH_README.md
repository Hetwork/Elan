# AuthModal Component

A comprehensive phone number authentication modal for your React Native Expo app, integrated with Firebase Authentication.

## Features

- 🌍 **Country Selection**: Complete country picker with flags and dial codes
- 📱 **Phone Authentication**: Firebase phone number authentication
- ✅ **Auto User Detection**: Automatically detects if user exists (sign in vs sign up)
- 📝 **User Registration**: Collects user details for new accounts
- 🎨 **Consistent Styling**: Matches your app's design system
- ⚡ **Loading States**: Visual feedback for all async operations
- 🛡️ **Error Handling**: Proper error messages and validation

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AuthModal } from '../components/Auth';

export const YourComponent = () => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  const handleAuthSuccess = () => {
    console.log('User authenticated successfully!');
    // Handle successful authentication
    // Navigate to main app, update state, etc.
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsAuthModalVisible(true)}>
        <Text>Sign In / Sign Up</Text>
      </TouchableOpacity>

      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </View>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Called when modal is closed |
| `onAuthSuccess` | `() => void` | ❌ | Called after successful authentication |

## Authentication Flow

### 1. Phone Number Entry
- User selects country and enters phone number
- Component automatically detects if user exists
- Sends verification code via Firebase

### 2. Code Verification
- User enters 6-digit verification code
- For existing users: completes sign in
- For new users: proceeds to profile setup

### 3. Profile Setup (New Users Only)
- Collects first name, last name, and email
- Creates user account in Firestore
- Completes authentication process

## Integration Requirements

### Firebase Configuration
Ensure your Firebase project is set up with:
- Phone Authentication enabled
- Firestore database configured
- Proper security rules

### Dependencies
The component uses these hooks from your existing codebase:
- `useSignUpWithPhoneNumber`
- `useSignInWithPhoneNumber` 
- `useConfirmVerificationCode`

### Country Data
Uses the countries utility from `../utils/countries.ts` for the country picker.

## Styling

The component follows your app's design system:
- **Primary Color**: `#333` (dark gray/black)
- **Background**: White with subtle grays
- **Accent**: Indigo for buttons
- **Border Radius**: 12px for inputs, 25px for modals
- **Typography**: System fonts with proper weights

## Error Handling

The component handles various error scenarios:
- Invalid phone numbers
- Network connectivity issues
- Invalid verification codes
- Duplicate user registration attempts
- Missing required fields

## Customization

You can customize the component by modifying the `styles` object at the bottom of the `Auth.tsx` file. The design system is consistent with your existing components like `Home.tsx` and `Button.tsx`.

## Notes

- The component is optimized for both iOS and Android
- Uses React Native's built-in components for maximum compatibility
- Includes proper accessibility support
- Handles keyboard navigation and dismissal
- Responsive design works on different screen sizes
