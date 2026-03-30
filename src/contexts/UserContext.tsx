import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
}

/** Generate initials from the user's name (e.g. "John Doe" → "JD") */
export function getInitials(user: UserProfile | null): string {
  if (!user) return '?';
  const first = user.firstName?.charAt(0)?.toUpperCase() || '';
  const last = user.lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  guestLogin: () => void;
  signup: (userData: any) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get<any>('/auth/get_user_details/');
      // Backend wraps the response in { msg, data }, so we unwrap it
      const data = response.data;
      setUser({
        id: data.id || '1',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        username: data.username || '',
        email: data.email || '',
        phoneNumber: data.phone_number || '',
        jobTitle: data.job_title || 'Designer',
        notificationsEnabled: data.notifications_enabled ?? true,
        twoFactorEnabled: data.two_factor_enabled ?? false,
      });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      logout();
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchUserDetails();
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const sendOtp = async (email: string) => {
    await api.post('/auth/send_otp/', { email }, { requireAuth: false });
  };

  const signup = async (userData: any) => {
    await api.post('/auth/signup/', userData, { requireAuth: false });
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await api.post<any>('/auth/login/', credentials, { requireAuth: false });
      // Backend wraps tokens inside response.data
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      await fetchUserDetails();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = () => {
    setUser({
      id: 'guest-1',
      firstName: 'Guest',
      lastName: 'User',
      username: 'guest',
      email: 'guest@example.com',
      phoneNumber: '000-000-0000',
      jobTitle: 'Guest Explorer',
      notificationsEnabled: true,
      twoFactorEnabled: false,
    });
  };

  const changePassword = async (data: any) => {
    await api.post('/auth/change_password/', data);
  };

  const resetPassword = async (data: any) => {
    await api.post('/auth/reset_password/', data, { requireAuth: false });
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      // Map frontend fields to backend fields
      const backendUpdates: any = {};
      if (updates.firstName) backendUpdates.first_name = updates.firstName;
      if (updates.lastName) backendUpdates.last_name = updates.lastName;
      if (updates.phoneNumber) backendUpdates.phone_number = updates.phoneNumber;
      if (updates.jobTitle) backendUpdates.job_title = updates.jobTitle;
      if (updates.notificationsEnabled !== undefined) backendUpdates.notifications_enabled = updates.notificationsEnabled;

      const response = await api.patch<any>('/auth/get_user_details/', backendUpdates);
      // Backend wraps the response in { msg, data }
      const data = response.data;
      setUser({
        id: data.id || '1',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        username: data.username || '',
        email: data.email || '',
        phoneNumber: data.phone_number || '',
        jobTitle: data.job_title || 'Designer',
        notificationsEnabled: data.notifications_enabled ?? true,
        twoFactorEnabled: data.two_factor_enabled ?? false,
      });
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, login, guestLogin, signup, sendOtp, changePassword, resetPassword, logout, refreshUser: fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
