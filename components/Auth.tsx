import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import {
  useSignUpWithPhoneNumber,
  useSignInWithPhoneNumber,
  useConfirmVerificationCode,
} from '../firebase/Hooks/UseAuth';
import { countries, Country } from '../utils/countries';
import { IUser } from '../firebase/Types/User';

const { width, height } = Dimensions.get('window');

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

type AuthStep = 'phone' | 'verification' | 'userDetails';

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  const [isSignUp, setIsSignUp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === 'US') || countries[0]
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
  
  // User details for sign up
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Hooks
  const signUpMutation = useSignUpWithPhoneNumber();
  const signInMutation = useSignInWithPhoneNumber();
  const confirmCodeMutation = useConfirmVerificationCode();

  const resetModal = () => {
    setAuthStep('phone');
    setIsSignUp(false);
    setPhoneNumber('');
    setVerificationCode('');
    setVerificationId(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setShowCountryPicker(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const formatPhoneNumber = (phone: string) => {
    return selectedCountry.dial_code + phone.replace(/^\+/, '');
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const fullPhoneNumber = formatPhoneNumber(phoneNumber);
    
    try {
      // Try to sign in first (this will fail if user doesn't exist)
      try {
        const result = await signInMutation.mutateAsync(fullPhoneNumber);
        setIsSignUp(false);
        setVerificationId(result);
        setAuthStep('verification');
      } catch (signInError: any) {
        // If sign in fails, try sign up
        if (signInError.message?.includes("doesn't exist")) {
          const result = await signUpMutation.mutateAsync(fullPhoneNumber);
          setIsSignUp(true);
          setVerificationId(result);
          setAuthStep('verification');
        } else {
          throw signInError;
        }
      }
    } catch (error: any) {
      console.error('Phone submission error:', error);
      Alert.alert('Error', error.message || 'Failed to send verification code');
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      console.log('Verification step - isSignUp:', isSignUp);
      if (isSignUp) {
        // For sign up, we need to collect user details first
        console.log('Moving to user details step');
        setAuthStep('userDetails');
      } else {
        // For sign in, confirm code directly
        console.log('Confirming verification code for sign in...');
        await confirmCodeMutation.mutateAsync({
          verificationId,
          code: verificationCode,
          isSignUp: false,
        });
        console.log('Sign in completed successfully');
        handleAuthSuccess();
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Invalid verification code');
    }
  };

  const handleSignUpComplete = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const userData: Partial<IUser> = {
        phoneNumber: formatPhoneNumber(phoneNumber),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        userType: 'user',
        role: 'user',
        isVerified: true,
        isProfileComplete: true,
        acceptedTerms: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Confirming verification code and creating user...');
      await confirmCodeMutation.mutateAsync({
        verificationId,
        code: verificationCode,
        isSignUp: true,
        userData,
      });

      console.log('Sign up completed successfully');
      handleAuthSuccess();
    } catch (error: any) {
      console.error('Sign up completion error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.message || 'Failed to complete registration');
    }
  };

  const handleAuthSuccess = () => {
    resetModal();
    onAuthSuccess?.();
    onClose();
  };

  const renderCountryPicker = () => (
    <Modal visible={showCountryPicker} animationType="slide" transparent>
      <View style={styles.countryPickerOverlay}>
        <View style={styles.countryPickerContainer}>
          <View style={styles.countryPickerHeader}>
            <Text style={styles.countryPickerTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countriesList}>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryCode}>{country.dial_code}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderPhoneStep = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.modalTitle}>Welcome to Elan</Text>
        <Text style={styles.modalSubtitle}>Enter your phone number to continue</Text>
      </View>

      <View style={styles.phoneInputContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
          <Feather name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, (signUpMutation.isPending || signInMutation.isPending) && styles.buttonDisabled]}
        onPress={handlePhoneSubmit}
        disabled={signUpMutation.isPending || signInMutation.isPending}
      >
        {(signUpMutation.isPending || signInMutation.isPending) ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </ScrollView>
  );

  const renderVerificationStep = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.modalTitle}>Verify Phone Number</Text>
        <Text style={styles.modalSubtitle}>
          Enter the 6-digit code sent to{'\n'}
          {selectedCountry.dial_code} {phoneNumber}
        </Text>
      </View>

      <TextInput
        style={styles.codeInput}
        placeholder="000000"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />

      <TouchableOpacity
        style={[styles.primaryButton, confirmCodeMutation.isPending && styles.buttonDisabled]}
        onPress={handleVerificationSubmit}
        disabled={confirmCodeMutation.isPending}
      >
        {confirmCodeMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.textButton} onPress={() => setAuthStep('phone')}>
        <Text style={styles.textButtonText}>Change phone number</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderUserDetailsStep = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.modalTitle}>Complete Your Profile</Text>
        <Text style={styles.modalSubtitle}>Tell us a bit about yourself</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          maxLength={50}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          maxLength={50}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          maxLength={100}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, confirmCodeMutation.isPending && styles.buttonDisabled]}
        onPress={handleSignUpComplete}
        disabled={confirmCodeMutation.isPending}
      >
        {confirmCodeMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Complete Registration</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {authStep === 'phone' && renderPhoneStep()}
            {authStep === 'verification' && renderVerificationStep()}
            {authStep === 'userDetails' && renderUserDetailsStep()}
          </View>
        </View>
      </Modal>
      {renderCountryPicker()}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: height * 0.7,
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeInput: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    fontSize: 24,
    letterSpacing: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  textButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Country Picker Styles
  countryPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryPickerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: width * 0.9,
    maxHeight: height * 0.7,
    overflow: 'hidden',
  },
  countryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  countryPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  countriesList: {
    maxHeight: height * 0.6,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryName: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});