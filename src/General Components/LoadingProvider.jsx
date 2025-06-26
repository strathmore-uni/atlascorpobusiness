import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Set loading state for a specific key
  const setLoading = useCallback((key, isLoading, message = '') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading, message }
    }));
  }, []);

  // Set global loading state
  const setGlobalLoadingState = useCallback((isLoading, message = 'Loading...') => {
    setGlobalLoading(isLoading);
    setLoadingMessage(message);
  }, []);

  // Clear all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
    setGlobalLoading(false);
    setLoadingMessage('');
  }, []);

  // Check if any loading state is active
  const isAnyLoading = globalLoading || Object.values(loadingStates).some(state => state.isLoading);

  // Get loading state for a specific key
  const getLoadingState = useCallback((key) => {
    return loadingStates[key] || { isLoading: false, message: '' };
  }, [loadingStates]);

  const value = {
    loadingStates,
    globalLoading,
    loadingMessage,
    isAnyLoading,
    setLoading,
    setGlobalLoadingState,
    clearAllLoading,
    getLoadingState
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {globalLoading && (
        <LoadingSpinner
          type="dots"
          size="large"
          color="blue"
          text={loadingMessage}
          fullScreen={true}
        />
      )}
    </LoadingContext.Provider>
  );
}; 