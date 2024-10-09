import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from 'react-icons/ai'; // Import the logout icon
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../store/slices/userSlice"; // Assuming you have a logout action in your auth slice

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
    try {
      // First, remove the token and role from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      // Dispatch the logout action (handle this with unwrap for async success handling)
      await dispatch(userLogout() as any).unwrap();
      // After logout completes, navigate to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error); // Handle errors if logout fails
    }
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
            className="absolute top-5 right-5 bg-blue-400 text-white px-4 py-1 rounded transition hover:bg-blue-600 flex items-center z-20" // Added z-index to ensure visibility
          >
            <AiOutlineLogout className="mr-2 text-black" /> {/* Add the icon with margin to the right */}
            Logout
          </button>
        </div>
      )}

      {/* Header with logo and navigation */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-10"> {/* Added z-index to avoid overlap */}
        <div className="flex items-center">
          {/* Logo */}
          <img
            src="../src/assets/images/logo.png" // Add your logo path here
            alt="Logo"
            className="w-24  mr-96"
          />
          {/* Navigation Links */}
          <nav className="flex space-x-24  text-gray-400 text-base">
            <a href="#" className="hover:underline">Home</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Fullscreen background cover with the landing page image */}
      <div
        className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(http://localhost:5000/uploads/landingpage.jpg)`, // Black gradient overlay
        }}
      >
        {/* Paragraph above the heading */}
        <div>
          <p className="text-gray-300 text-lg mb-2">There is luxury in Simplicity</p>
        </div>

        {/* Heading with custom font */}
        <h1
          className="text-6xl font-semibold text-gray-500 bg-opacity-50 p-5"
          style={{ fontFamily: `'Jacques Francois', serif` }} // Custom font style
        >
          Come as a Guest, Leave as a Friend
        </h1>
        <button
          onClick={() => navigate('/homstay-listing')} // Wrap navigate in an arrow function
          className="mt-5 bg-blue-800 bg-opacity-50 text-white py-2 px-6 rounded-full text-lg transition duration-300 hover:bg-opacity-100 hover:bg-blue-800"
        >
          Explore Now
        </button>


      </div>
    </>
  );
};

export default Home;
