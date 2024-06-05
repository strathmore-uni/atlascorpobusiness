
import { auth } from '../Firebase';
export default function SignOutUsers() {
    auth.signOut()
    .then(() => {
      // Sign-out successful.
      console.log('User signed out successfully.');
    })
    .catch((error) => {
      // An error happened.
      console.error('Error signing out:', error);
    });

    

}
