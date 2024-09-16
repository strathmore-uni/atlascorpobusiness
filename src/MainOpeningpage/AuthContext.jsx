import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_LOCAL}/verifyToken`, { token });
          setCurrentUser({ email: response.data.email });
          console.log('User is authenticated:', response.data.email); // Add this line
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    

    verifyToken();
  }, []);

  const signOut = async () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
  };

  const signIn = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('authToken', token);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
