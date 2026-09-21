import React, { createContext, useContext, useState } from 'react';

const DEMO_FARMER = {
  farmerId: 'MH-NSK-2024-8842',
  name: 'Ramesh Baburao Patil',
  phone: '9876543210',
  fpoName: 'Sahyadri Farmers Producer Co.',
  village: 'Ozar Mig',
  district: 'Nashik, Niphad',
  primaryCrop: 'Wheat',
  language: 'en',
  isProfileComplete: true
};

const AuthContext = createContext({
  currentUser: DEMO_FARMER,
  isAuthenticated: true,
  isProfileComplete: true,
  login: async () => ({ success: true }),
  signup: async () => ({ success: true }),
  logout: async () => {}
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_FARMER);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: true,
        isProfileComplete: true,
        login: async () => ({ success: true }),
        signup: async () => ({ success: true }),
        logout: async () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
