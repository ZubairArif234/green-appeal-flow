import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, LoginRequest, RegisterRequest } from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: 'user' | 'admin';
  isFreeTrialUser: boolean;
  noOfCasesLeft: number;
  planType?: string;
  planId?: string;
  subscriptionId?: string;
  customerId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  logout: () => void;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, otp: string, password: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth called outside AuthProvider. Current context:', context);
    console.error('Stack trace:', new Error().stack);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = apiService.getAuthToken();
    if (storedToken) {
      setToken(storedToken);
      // Verify token with backend
      getCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = async (skipLoading = false) => {
    if (!skipLoading) setIsLoading(true);
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        console.log('Token validation failed:', response.error);
        // Token is invalid, remove it
        logout();
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      logout();
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        setToken(authToken);
        setUser(userData);
        apiService.setAuthToken(authToken);
        
        // After login, fetch complete user profile to ensure we have all fields
        await getCurrentUser(true);
        
        // Return the user data for redirect logic
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          error: response.error || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        // Registration successful, but user needs to verify email
        return { 
          success: true, 
          needsVerification: true 
        };
      } else {
        return { 
          success: false, 
          error: response.error || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.verifyEmail({ email, otp });
      
      if (response.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Email verification failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Email verification failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.forgotPassword({ email });
      
      if (response.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Failed to send reset email' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send reset email' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.resetPassword({ 
        email, 
        passwordResetToken: otp, 
        password 
      });
      
      if (response.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Password reset failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiService.removeAuthToken();
  };

  const refreshUser = async () => {
    await getCurrentUser(true);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
