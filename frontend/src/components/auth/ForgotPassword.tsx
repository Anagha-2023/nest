import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendResetPasswordEmail } from '../../store/slices/userSlice';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous messages
    setError(null); // Clear previous errors

    if (!email) {
      setError('Please enter your email address');
      setLoading(false); // Reset loading state
      return;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false); // Reset loading state
      return;
    }
    
    try {
      const result = await dispatch(sendResetPasswordEmail(email) as any);

      if (result.meta.requestStatus === 'fulfilled') {
        setMessage(result.payload.message || 'Reset email link sent successfully');
      } else {
        setError(result.payload || 'Failed to reset email');
      }

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
      setMessage(null);

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <img
        src='../src/assets/images/logo_black.png'
        alt='Logo'
        className='absolute top-5 left-5 w-20'
      />
      <div className="max-w-md w-full rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-start mb-6">
          Forgot Password
        </h2>
        <p className="text-gray-600 mb-4">
          Enter your email address below to receive a password reset link.
        </p>
        {message && <p className='text-green-600 text-center mb-4'>{message}</p>}
        {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-2 rounded focus:outline-none focus:shadow-lg focus:shadow-gray-700 bg-blue-100 shadow-md shadow-gray-700"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-2/3 py-2 bg-black text-white font-semibold rounded-3xl transition duration-300 ease-in-out ${loading ? 'backdrop-blur-md opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-200"></div>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>

      {/* Image under the form */}
      <div className="w-full max-w-md">
        <img
          src="../src/assets/images/forgot password.jpg"
          alt="Forgot Password Illustration"
          className="w-max h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
