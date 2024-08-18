import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from './AuthContext'; // Adjust the import path as needed
import { auth } from '../Firebase'; // Ensure this import matches your Firebase configuration

const SignOutUsers = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Destructure currentUser from useAuth

  const handleSignOut = async () => {
    try {
      

      // Sign out the user from Firebase
      await auth.signOut();

      // Clear local storage and navigate to the sign-in page
      localStorage.removeItem('userEmail'); // Make sure this is the correct key
      navigate('/signin');
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  useEffect(() => {
    handleSignOut();
  }, []);

  return null; // Render nothing as the sign-out process is handled in useEffect
};

export default SignOutUsers;
