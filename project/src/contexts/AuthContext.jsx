import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login function that accepts Firebase user
  const login = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Logout function with Firebase signOut
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    // Additional user info helpers
    userEmail: currentUser?.email,
    userName: currentUser?.displayName,
    userPhoto: currentUser?.photoURL,
    userId: currentUser?.uid,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};