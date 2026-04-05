import React, { createContext, useContext, useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
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

  // Initialize auth state from localStorage (matches mobile's checkLoginStatus)
  useEffect(() => {
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = localStorage.getItem("token");
      
      if (userInfoStr && token) {
        const parsedUser = JSON.parse(userInfoStr);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error assessing auth state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("userInfo", JSON.stringify(user));
    if (token) localStorage.setItem("token", token);
  };

  const logout = async () => {
    try {
      await signOut(auth); // ensure firebase is also cleared if they used google
    } catch(err) {
      console.log('Firebase logout ignored')
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("artbloom_notifications"); // Prevent admin notification leaks
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    userEmail: currentUser?.email,
    userName: currentUser?.name || currentUser?.displayName,
    userPhoto: currentUser?.imageUrl || currentUser?.photoURL,
    userId: currentUser?._id || currentUser?.uid,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};