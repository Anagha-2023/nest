import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (error.response.status === 401 || error.response.status === 403) {
      const userRole = localStorage.getItem('role');
      console.log("Role:", userRole);
      
      // Redirect based on role
      if (userRole === 'admin') {
        window.location.href = '/admin-login';
      } else if (userRole === 'host') {
        window.location.href = '/host-login';
      } else {
        window.location.href = '/login'; // Default for users
      }
    }
    return Promise.reject(error);
  }
);

export default api;
