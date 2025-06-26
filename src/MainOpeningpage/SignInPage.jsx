import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../Firebase';
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NavigationBar from '../General Components/NavigationBar';
import LoadingSpinner from '../General Components/LoadingSpinner';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const SignInPage = () => {
  const { signIn, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirecting && currentUser) {
      setTimeout(() => {
        if (currentUser.isAdmin || currentUser.isMiniAdmin ) {
          navigate('/dashboard');
        } else if (currentUser.isWarehouse) {
          navigate('/warehouse/dashboard');
        } else if(currentUser.isFinance){
          navigate('/finance/dashboard');
        } else {
          navigate('/shop')
        }
      }, 3000); // 3 seconds delay
    }
  }, [redirecting, currentUser, navigate]);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log('Google Sign-In successful:', result);
        setIsLoading(false);
        setRedirecting(true);
      })
      .catch((error) => {
        console.error('Error during Google Sign-In:', error);
        setIsLoading(false);
        setError('Google sign-in failed. Please try again.');
      });
  };

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/login`, { email, password });
  
      // Check for specific response status or data indicating account suspension
      if (response.data.suspended) {
        setError('Your account has been suspended. Please contact support.');
      } else if (response.data.token) {
        const { token, isAdmin, isMiniAdmin, isWarehouse, isFinance, country } = response.data;
        const currentUser = { email, isAdmin, isMiniAdmin, isWarehouse, isFinance, country };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('token', token);
        localStorage.setItem('country', country);
  
        signIn(currentUser, token);
        setRedirecting(true);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Login failed. Please check your credentials and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner
            type="wave"
            size="large"
            color="white"
            text="Signing you in..."
            fullScreen={false}
          />
          <p className="mt-4 text-lg font-medium">Welcome to Atlas Copco!</p>
          <p className="mt-2 text-blue-100">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavigationBar />
      
      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Welcome to Atlas Copco
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Access your industrial solutions dashboard and manage your account with ease.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  <span className="text-blue-100">Secure authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaLock className="text-white text-sm" />
                  </div>
                  <span className="text-blue-100">24/7 access to your account</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaArrowRight className="text-white text-sm" />
                  </div>
                  <span className="text-blue-100">Quick navigation to services</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600 rounded-full opacity-10"></div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <FaLock className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Welcome back! Please enter your details to continue.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleEmailSignIn}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner type="ring" size="small" color="white" text="" />
                      <span>Signing in...</span>
          </div>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
          </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <LoadingSpinner type="ring" size="small" color="gray" text="" />
                    ) : (
                      <FaGoogle className="h-5 w-5 text-red-500 mr-3" />
                    )}
              <span>Sign in with Google</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/Checkout"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
