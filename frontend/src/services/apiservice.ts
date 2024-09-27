import axios from "axios";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useEffect } from "react";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Function to set up interceptors
const setupInterceptors = (navigate: NavigateFunction) => {
  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response, // On success, just return the response
    (error) => {
      if (error.response) {
        console.log('Response Error:', error.response); // Log error response

        // Check for 401 or 403 Unauthorized errors
        if (error.response.status === 401 || error.response.status === 403) {
          // Clear the token and redirect to the correct login page
          localStorage.removeItem('token');
          const role = localStorage.getItem('role');
          console.log('Redirecting to login page'); // Log redirect action

          // Navigate to the correct login page based on role
          if (role === 'admin') {
            navigate('/admin-login');
          } else if (role === 'host') {
            navigate('/host-login');
          } else {
            navigate('/login');
          }
        }
      } else {
        console.log('Error without response:', error); // Log non-response error
      }
      return Promise.reject(error);
    }
  );
};

// Custom hook to use the Axios instance
export const useApi = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate); // Set up interceptors with the navigate function
  }, [navigate]); // Dependency array ensures it runs only once

  return api; // This can still be used in components if needed
};

export default api; // Export the Axios instance directly
