'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  createUser, 
  signIn, 
  logOut, 
  getCurrentUser,
  signInWithGoogle,
  signInWithFacebook
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
  const [isNewUser, setIsNewUser] = useState(false);

  // Register a new user
  const signup = async (email, password) => {
    setError('');
    const result = await createUser(email, password);
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setIsNewUser(true);
    return { success: true, isNewUser: true };
  };

  // Login an existing user
  const login = async (email, password) => {
    setError('');
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    // Set new user status from result
    setIsNewUser(result.isNewUser === true);
    return { success: true, isNewUser: result.isNewUser === true };
  };

  // Logout the current user
  const logout = async () => {
    setError('');
    const result = await logOut();
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setIsNewUser(false);
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
  
  // Login with Google
  const loginWithGoogle = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    // Set new user status from result
    setIsNewUser(result.isNewUser === true);
    return { success: true, isNewUser: result.isNewUser === true };
  };

  // Login with Facebook
  const loginWithFacebook = async () => {
    setError('');
    const result = await signInWithFacebook();
    if (result.error) {
      setError(result.error);
      return { success: false, error: result.error };
    }
    // Set new user status from result
    setIsNewUser(result.isNewUser === true);
    return { success: true, isNewUser: result.isNewUser === true };
  };

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    isNewUser,
    signup,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    setIsNewUser // Expose this to reset the state after tutorial is shown
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
