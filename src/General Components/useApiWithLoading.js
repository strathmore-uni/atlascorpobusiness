import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useApiWithLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
        ...config
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}) => apiCall('GET', url, null, config), [apiCall]);
  const post = useCallback((url, data = null, config = {}) => apiCall('POST', url, data, config), [apiCall]);
  const put = useCallback((url, data = null, config = {}) => apiCall('PUT', url, data, config), [apiCall]);
  const del = useCallback((url, config = {}) => apiCall('DELETE', url, null, config), [apiCall]);

  return {
    loading,
    error,
    apiCall,
    get,
    post,
    put,
    delete: del
  };
};

export default useApiWithLoading; 