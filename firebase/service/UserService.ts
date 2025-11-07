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

    const userRef = db.collection(this.COLLECTION).doc(currentUser.uid);
    return await userRef.set(userDoc);
  }

  // Get user data
  static async getUserData(uid?: string): Promise<IUser | null> {
    const userId = uid || auth.currentUser?.uid;
    if (!userId) throw new Error('No user ID provided');

    console.log('UserService: Getting user data for:', userId);
    
    try {
      const userRef = db.collection(this.COLLECTION).doc(userId);
      const userSnap = await userRef.get();
      
      console.log('UserService: User document exists:', userSnap.exists);
      
      if (userSnap.exists) {
        const userData = userSnap.data() as IUser;
        console.log('UserService: User data retrieved:', {
          hasFirstName: !!userData.firstName,
          hasEmail: !!userData.email,
          hasPhone: !!userData.phoneNumber,
          hasAddress: !!userData.address,
        });
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('UserService: Error getting user data:', error);
      throw error;
    }
  }

  // Update user data
  static async updateUser(userData: Partial<IUser>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    const userRef = db.collection(this.COLLECTION).doc(currentUser.uid);
    return await userRef.update(updateData);
  }

  // Delete user data
  static async deleteUser() {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const userRef = db.collection(this.COLLECTION).doc(currentUser.uid);
    return await userRef.delete();
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<IUser[]> {
    const usersRef = db.collection(this.COLLECTION);
    const querySnapshot = await usersRef.get();
    return querySnapshot.docs.map((doc: any) => doc.data() as IUser);
  }

  // Get users by role
  static async getUsersByRole(role: UserRole): Promise<IUser[]> {
    const usersRef = db.collection(this.COLLECTION);
    const querySnapshot = await usersRef.where('role', '==', role).get();
    return querySnapshot.docs.map((doc: any) => doc.data() as IUser);
  }

  // Check if user profile is complete
  static async isProfileComplete(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const userRef = db.collection(this.COLLECTION).doc(currentUser.uid);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists) return false;
    
    const userData = userSnap.data() as IUser;
    return userData.isProfileComplete || false;
  }

  // Create test user data for debugging
  static async createTestUser(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    const testUserData: Partial<IUser> = {
      uid: currentUser.uid,
      phoneNumber: currentUser.phoneNumber || "+91 9999999999",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      userType: "user",
      role: "user",
      isVerified: true,
      isProfileComplete: true,
      acceptedTerms: true,
      address: {
        street: "123 Test Street",
        city: "Test City", 
        state: "Test State",
        zipCode: "123456",
        country: "India",
        isDefault: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('UserService: Creating test user data:', testUserData);
    
    const userRef = db.collection(this.COLLECTION).doc(currentUser.uid);
    await userRef.set(testUserData);
    
    console.log('UserService: Test user data created successfully');
  }
}
