import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../Firebase'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [IsAuthenticated, setIsAuthenticated] = useState(false); // Add this state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true); // Update IsAuthenticated state
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false); // Update IsAuthenticated state
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signIn = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };



  const value = {
    currentUser,
    signIn,
    signOut,
  };


  return (
    <AuthContext.Provider value={{ value,currentUser, loading, setCurrentUser, signOut, IsAuthenticated }}>
    {!loading && children}
  </AuthContext.Provider>
  );
};
