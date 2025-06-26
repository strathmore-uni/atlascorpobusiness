import { useState, useCallback } from 'react';
import { useLoading } from './LoadingProvider';

export const useApiWithLoading = () => {
  const { setLoading, setGlobalLoadingState } = useLoading();
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (
    apiFunction,
    loadingKey = 'default',
    options = {}
  ) => {
    const {
      showGlobalLoading = false,
      loadingMessage = 'Loading...',
      errorMessage = 'An error occurred',
      onSuccess,
      onError,
      onFinally
    } = options;

    try {
      setError(null);
      
      if (showGlobalLoading) {
        setGlobalLoadingState(true, loadingMessage);
      } else {
        setLoading(loadingKey, true, loadingMessage);
      }

      const result = await apiFunction();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || errorMessage;
      setError(errorMsg);
      
      if (onError) {
        onError(err, errorMsg);
      }
      
      throw err;
    } finally {
      if (showGlobalLoading) {
        setGlobalLoadingState(false);
      } else {
        setLoading(loadingKey, false);
      }
      
      if (onFinally) {
        onFinally();
      }
    }
  }, [setLoading, setGlobalLoadingState]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    apiCall,
    error,
    clearError
  };
}; 