import { auth } from '../Firebase'; // Adjust the import path as necessary

const SignOutUser = ({}) => {
  auth.signOut()
    .then(() => {
  
    })
    .catch((error) => {
      
      console.error('Error signing out:', error);
    });
    const clearCart = () => {
      // Implement logic to clear the cart items from your application state or storage mechanism
    };
};

export default SignOutUser;
