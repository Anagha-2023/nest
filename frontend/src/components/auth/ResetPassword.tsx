import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../store/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom'; // For getting the token from URL
import Spinner from '../Spinner';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>(''); // For tracking success message
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()
  // Get the token from the URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Get the token
  console.log("Token", token);

  const validateForm = () => {
    let newErrors: { password?: string; confirmPassword?: string } = {};

    // Validate newPassword
    if (!newPassword.trim()) {
      newErrors.password = 'Password is required';
    } else {
      if (newPassword.length < 6) {
        newErrors.password = 'Password must contain at least 6 characters';
      }
      if (!/[A-Z]/.test(newPassword)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(newPassword)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(newPassword)) {
        newErrors.password = 'Password must contain at least one numeric value';
      }
      if (!/[!@#$%^&*]/.test(newPassword)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    // Validate confirmPassword
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && token) {
      setLoading(true)
      try {
        await dispatch(resetPassword({ token, newPassword, confirmPassword }) as any);
        setErrors({});
        setSuccessMessage('Password reset successfully! You can now login with your new password.');
        navigate('/host-login')
      } catch (err: any) {
        console.error('Error resetting password:', err);
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      
      {/* Blue background section */}
      <div className="absolute inset-0 bg-indigo-400 h-1/3 w-full z-0"></div>
      <img
        src='../src/assets/images/logo_black.png'
        alt='Logo'
        className='absolute top-5 left-5 w-20'
      />
      
      <div className="max-w-md w-full bg-white shadow-lg shadow-gray-800 rounded-lg p-8 z-10 relative">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your new password below.
        </p>

        {/* Display success message */}
        {successMessage && (
          <div className="mb-4 text-green-600 text-center font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {errors.password && <p className="text-xs font-medium text-red-500 mb-3">{errors.password}</p>}
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="New Password"
              required
            />
          </div>
          <div>
            {errors.confirmPassword && <p className="text-xs font-medium text-red-500 mb-3">{errors.confirmPassword}</p>}
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
      <img 
        src="../src/assets/images/ResetPassword.jpg" // Replace with your image path
        alt="Description"
        className="absolute bottom-0 left-0  w-82 h-72 object-cover z-10"
      />
    </div>
  );
};

export default ResetPassword;
