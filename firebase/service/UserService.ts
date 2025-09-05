import { db, auth } from '../firebase';
import { IUser, UserRole } from '../Types/User';

export class UserService {
  private static COLLECTION = 'users';

  // Create user data
  static async createUser(userData: Partial<IUser>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const userDoc: Partial<IUser> = {
      uid: currentUser.uid,
      phoneNumber: currentUser.phoneNumber ?? "",
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { doc, setDoc } = await import('@react-native-firebase/firestore');
    const userRef = doc(db, this.COLLECTION, currentUser.uid);
    return await setDoc(userRef, userDoc);
  }

  // Get user data
  static async getUserData(uid?: string): Promise<IUser | null> {
    const userId = uid || auth.currentUser?.uid;
    if (!userId) throw new Error('No user ID provided');

    const { doc, getDoc } = await import('@react-native-firebase/firestore');
    const userRef = doc(db, this.COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? (userSnap.data() as IUser) : null;
  }

  // Update user data
  static async updateUser(userData: Partial<IUser>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    const { doc, updateDoc } = await import('@react-native-firebase/firestore');
    const userRef = doc(db, this.COLLECTION, currentUser.uid);
    return await updateDoc(userRef, updateData);
  }

  // Delete user data
  static async deleteUser() {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const { doc, deleteDoc } = await import('@react-native-firebase/firestore');
    const userRef = doc(db, this.COLLECTION, currentUser.uid);
    return await deleteDoc(userRef);
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<IUser[]> {
    const { collection, getDocs } = await import('@react-native-firebase/firestore');
    const usersRef = collection(db, this.COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => doc.data() as IUser);
  }

  // Get users by role
  static async getUsersByRole(role: UserRole): Promise<IUser[]> {
    const { collection, query, where, getDocs } = await import('@react-native-firebase/firestore');
    const usersRef = collection(db, this.COLLECTION);
    const q = query(usersRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as IUser);
  }

  // Check if user profile is complete
  static async isProfileComplete(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const { doc, getDoc } = await import('@react-native-firebase/firestore');
    const userRef = doc(db, this.COLLECTION, currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data() as IUser;
    return userData.isProfileComplete || false;
  }
}
