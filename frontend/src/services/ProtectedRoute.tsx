import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole: string;
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // If no token, redirect to the correct login page based on role
  if (!token) {
    switch (requiredRole) {
      case 'admin':
        return <Navigate to="/admin-login" replace />;
      case 'host':
        return <Navigate to="/host-login" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If the token exists but role does not match, redirect to the respective login
  if (userRole !== requiredRole) {
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin-login" replace />;
      case 'host':
        return <Navigate to="/host-login" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If the role matches, allow access to the protected route
  return element;
};

export default ProtectedRoute;
