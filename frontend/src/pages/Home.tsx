import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from 'react-icons/ai'; // Import the logout icon
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/adminSlice"; // Assuming you have a logout action in your auth slice

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate a delay for demonstration purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    await dispatch(logout() as any); // Dispatch the logout action
    navigate("/login"); // Redirect to the login page
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen relative">
          {/* Spinning Circle */}
          <div className="absolute w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          {/* Home Icon in the Center */}
          <div role="status" className="relative z-10">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-black"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l-10 10h3v10h6v-6h4v6h6v-10h3z" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleLogout}
            className="absolute top-5 right-5 bg-blue-400 text-white px-4 py-1 rounded transition hover:bg-blue-600 flex items-center" // Add flex to align items
          >
            <AiOutlineLogout className="mr-2 text-black" /> {/* Add the icon with margin to the right */}
            Logout
          </button>
        </div>
      )}
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to Homestay Booking Platform</h1>
      </div>
    </>
  );
};

export default Home;
