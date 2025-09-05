import { makeAutoObservable } from 'mobx';

export type UserRole = 'user' | 'admin';

export interface Address {
  city: string;
  country: string;
  isDefault: boolean;
  state: string;
  street: string;
  zipCode: string;
}

export interface IUser {
  uid: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserRole;
  role: UserRole;
  isVerified: boolean;
  isProfileComplete: boolean;
  acceptedTerms: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  address: Address;
  profileImage?: string | null;
}

export class UserStore {
  user: IUser | null = null;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: IUser) {
    this.user = user;
  }

  clearUser() {
    this.user = null;
  }

  setLoading(val: boolean) {
    this.loading = val;
  }

  get isLoggedIn() {
    return !!this.user;
  }

  get isBuyer() {
    return this.user?.userType === 'user';
  }
  get isAdmin() {
    return this.user?.role === 'admin';
  }
}
