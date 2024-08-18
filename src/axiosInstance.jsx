import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure(); // Initialize the toast notifications

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            // Show notification and redirect to login
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('token');  // Remove the expired token

            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
