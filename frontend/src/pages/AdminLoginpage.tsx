import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../store/slices/adminSlice';
import { RootState } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // Email validation error state
  const [passwordError, setPasswordError] = useState(''); // Password validation error state
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, admin } = useSelector((state: RootState) => state.admin);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation for email and password
  const validateFields = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateFields()) {
      setLoading(true);
      try {
        const result = await dispatch(adminLogin({ email, password }) as any).unwrap();

        if (result?.token) {
          navigate('/admin-home');
        }
      } catch (error) {
        console.error('Login failed', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative h-screen bg-blue-200">
      {/* Logo in the top left corner */}
      <img
        src="../src/assets/images/logo_black.png"
        alt="Logo"
        className="absolute top-5 left-5 w-20"
      />
      <div className="grid grid-cols-2 h-screen">
        <div className="flex justify-center items-center bg-white-100">
          <img
            src="../src/assets/images/admin.png"
            alt="admin-login"
            className="w-85 h-85 object-cover md:w-3/4 md:h-auto"
          />
        </div>
        <div className="flex justify-center items-center h-screen bg-gradient-to-r">
          <form onSubmit={handleSubmit} className="w-2/3 bg-blue-400 p-6 pt-7 pb-9 rounded-xl">
            <h2 className="flex justify-center text-2xl font-bold mb-7">Welcome Admin!</h2>

            {/* Show error message if login failed */}
            {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

            {/* Show success message if login is successful */}
            {admin && <p className="text-green-600">Successfully Logged In!</p>}

            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md hover:border-blue-300 hover:shadow-2xl focus:border-blue-500 focus:shadow-xl outline-none"
              />
              {emailError && <p className="text-red-500">{emailError}</p>}
            </div>

            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md hover:border-blue-300 hover:shadow-2xl focus:border-blue-500 focus:shadow-xl outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 hover:text-lg"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>

            <p
              onClick={() => navigate('/forgot-password')}
              className="flex justify-end text-1xl font mb-4 text-blue-900 hover:text-white transition duration-200 ease-in-out hover:scale-95 hover:cursor-pointer"
            >
              Forgot Password?
            </p>

            <div className="flex justify-center relative">
              {/* Button */}
              <button
                type="submit"
                className={`w-3/4 bg-gradient-to-t from-blue-500 to-indigo-900 text-white text-xl font-bold p-2 rounded-full transform transition duration-500 ease-in-out hover:shadow-lg hover:from-indigo-900 hover:to-blue-500 active:transition-none active:scale-95 ${loading ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                {loading ? "Login..." : "Login"}  {/* Hide button text while loading */}
              </button>

              {/* Spinner */}
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center z-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-950"></div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
