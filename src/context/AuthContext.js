'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  createUser, 
  signIn, 
  logOut, 
  getCurrentUser 
} from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register a new user
  const signup = async (email, password) => {
    setError('');
    const result = await createUser(email, password);
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  // Login an existing user
  const login = async (email, password) => {
    setError('');
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  // Logout the current user
  const logout = async () => {
    setError('');
    const result = await logOut();
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
