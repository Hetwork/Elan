import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class AuthService {
  // Sign up with phone number (new users)
  static async signUpWithPhoneNumber(phoneNumber: string) {
    const usersRef = firestore().collection('users');
    const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).get();

    if (!querySnapshot.empty) {
      throw new Error("User already exists. Please sign in.");
    }

    // Send OTP
    return await auth().signInWithPhoneNumber(phoneNumber);
  }

  // Sign in with phone number (existing users)
  static async signInWithPhoneNumber(phoneNumber: string) {
    const usersRef = firestore().collection('users');
    const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).get();

    if (querySnapshot.empty) {
      throw new Error("User doesn't exist. Please sign up first.");
    }

    return await auth().signInWithPhoneNumber(phoneNumber);
  }

  // Confirm verification code
  static async confirmVerificationCode(verificationId: string, code: string) {
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);
    return await auth().signInWithCredential(credential);
  }

  // Get current user
  static getCurrentUser() {
    return auth().currentUser;
  }

  // Sign out
  static async signOut() {
    return await auth().signOut();
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }

  // Delete user account
  static async deleteUser() {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('No authenticated user');
    return await currentUser.delete();
  }

  // Check if user exists
  static async checkUserExists(phoneNumber: string): Promise<boolean> {
    try {
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef.where('phoneNumber', '==', phoneNumber).get();
      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  }
}
