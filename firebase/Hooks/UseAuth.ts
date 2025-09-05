import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../service/AuthService';
import { UserService } from '../service/UserService';
import { IUser } from '../Types/User';

// Sign up with phone number
export const useSignUpWithPhoneNumber = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => AuthService.signUpWithPhoneNumber(phoneNumber),
  });
};

// Sign in with phone number
export const useSignInWithPhoneNumber = () => {
  return useMutation({
    mutationFn: (phoneNumber: string) => AuthService.signInWithPhoneNumber(phoneNumber),
  });
};

// Confirm verification code
// Confirm verification code and create user on signup
export const useConfirmVerificationCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ verificationId, code, isSignUp, userData }: { 
      verificationId: any; 
      code: string; 
      isSignUp?: boolean;
      userData?: Partial<IUser>;
    }) => {
      const result = await AuthService.confirmVerificationCode(verificationId, code);
      
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