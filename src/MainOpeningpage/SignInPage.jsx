import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../Firebase';
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NavigationBar from '../General Components/NavigationBar';
import './SignInPage.css';
import axios from 'axios';

const SignInPage = () => {
  const { signIn, currentUser, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/shop');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log('Google Sign-In successful:', result);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/productdetails');
        }, 1000); // Ensure delay is noticeable
      })
      .catch((error) => {
        console.error('Error during Google Sign-In:', error);
        setIsLoading(false);
      });
  };



  const handleEmailSignIn = async (event) => {
    event.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/login`, { email, password });
      if (response.data.token) {
        const { token, isAdmin, isMiniAdmin, id, country } = response.data;
        const currentUser = { email, isAdmin, isMiniAdmin, id, country };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('token', token); // Store the token separately
        localStorage.setItem('country', country); // Store the country separately
  
        signIn(currentUser, token);
        setTimeout(() => {
          setIsLoading(false);
          if (isAdmin) {
            navigate('/dashboard');
          } else if (isMiniAdmin) {
            navigate('/dashboard');
          } else {
            navigate('/shop');
          }
        }, 5000);
      } else {
        setError('Login failed. Please check your credentials and try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your credentials and try again.');
      setIsLoading(false);
    }
  };

  
  

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className='signincontainer'>
      <div className="form-container">
        {error && <p className='error_login'>{error}</p>}
        <div className="line-container">
          <div className="line"></div>
          <div className="or">or</div>
          <div className="line"></div>
        </div>
        <p className="title">Sign in</p>
        <form className="form" onSubmit={handleEmailSignIn}>
          <label className='lbl_signin'>Email</label>
          <input type="email" className="input-email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <label className='lbl_signin'>Password</label>
          <input type="password" className='input-password' placeholder='Password' onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="signin-form-btn">Sign in</button>
        </form>
        <div className="buttons-container">
          <div className="google-login-button" onClick={handleGoogleSignIn}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" className="google-icon" viewBox="0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            <span>Sign in with Google</span>
          </div>
          <p className='signup_link'>Don't have an Account?<Link to="/Checkout" className='link'>Sign Up</Link></p>
          <p onClick={handleForgotPassword} className='signinforgotbtn'>Forgot password?</p>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default SignInPage;
