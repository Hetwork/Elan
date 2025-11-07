import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../service/AuthService';
import { UserService } from '../service/UserService';
import { IUser } from '../Types/User';

// Sign up with phone number (returns confirmation object)
export const useSignUpWithPhoneNumber = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => AuthService.signUpWithPhoneNumber(phoneNumber),
  });
};

// Sign in with phone number (returns confirmation object)
export const useSignInWithPhoneNumber = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => AuthService.signInWithPhoneNumber(phoneNumber),
  });
};

// Confirm verification code
export const useConfirmVerificationCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      confirmation,
      code,
      isSignUp,
      userData,
    }: {
      confirmation: any;
      code: string;
      isSignUp?: boolean;
      userData?: Partial<IUser>;
    }) => {
      const result = await AuthService.confirmVerificationCode(confirmation, code);

      if (isSignUp && userData) {
        await UserService.createUser(userData);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserData'] });
    },
  });
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => AuthService.getCurrentUser(),
  });
};

// Sign out
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AuthService.deleteUser(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Check if user exists
export const useCheckUserExists = (phoneNumber: string) => {
  return useQuery({
    queryKey: ['userExists', phoneNumber],
    queryFn: () => AuthService.checkUserExists(phoneNumber),
    enabled: !!phoneNumber,
  });
};

// Get current user data from Firestore
export const useCurrentUserData = () => {
  return useQuery({
    queryKey: ['currentUserData'],
    queryFn: async () => {
      const userData = await UserService.getUserData();
      console.log('Current user data:', userData);
      return userData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user data
export const useUpdateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: Partial<IUser>) => UserService.updateUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserData'] });
    },
  });
};

// Create test user data
export const useCreateTestUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => UserService.createTestUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserData'] });
    },
  });
};
