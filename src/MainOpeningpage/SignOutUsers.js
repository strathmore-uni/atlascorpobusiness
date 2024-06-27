import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const SignOutUsers = () => {
  const navigate = useNavigate();

  auth.signOut()
    .then(() => {
      localStorage.removeItem('userEmail'); // Remove user email from local storage
      navigate('/signin'); // Navigate to the sign-in page or another appropriate page
      console.log('User signed out successfully.');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
};

export default SignOutUsers;
