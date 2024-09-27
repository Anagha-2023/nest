// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { logout } from "../../store/slices/adminSlice"; // Adjust the import path based on your structure
import UserManagement from "./UserManagement"; // Import the UserManagement component
import HostManagement from "./HostManagement";
import { AiOutlineLogout } from 'react-icons/ai'; // Import the logout icon


const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a delay (you can replace this with actual API calls)
    return () => clearTimeout(timer);
  }, []);

  // Function to render the active section content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <h2 className="flex justify-center text-3xl font-semibold text-gray-700">Welcome to the Dashboard!</h2>;
      case "userManagement":
        return <UserManagement />; // Use the separated UserManagement component
      case "hostManagement":
        return <HostManagement />;
      default:
        return null;
    }
  };

  const renderHeading = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "userManagement":
        return "User Management";
      case "hostManagement":
        return "Host Management";
      default:
        return "Admin Dashboard";
    }
  };

  // Handle logout functionality
  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    await dispatch(logout() as any); // Dispatch the logout action
    navigate("/admin-login"); // Redirect to the admin login page
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-blue-200 p-4">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="../src/assets/images/logo_black.png"
            alt="Logo"
            className="absolute top-5 left-5 w-20"
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-20">
          <ul className="space-y-8">
            <li>
              <a
                href="#"
                className={`block text-gray-700 font-semibold p-2 rounded transition-transform duration-500 transform ${activeSection === "dashboard"
                  ? "scale-105 bg-blue-300"
                  : "hover:bg-blue-100 hover:scale-105 active:bg-blue-100 active:scale-105"
                  }`}
                onClick={() => setActiveSection("dashboard")}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-gray-700 font-semibold p-2 rounded transition-transform duration-500 transform ${activeSection === "userManagement"
                  ? "scale-105 bg-blue-300"
                  : "hover:bg-blue-100 hover:scale-105 active:bg-blue-100 active:scale-105"
                  }`}
                onClick={() => setActiveSection("userManagement")}
              >
                User Management
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-gray-700 font-semibold p-2 rounded transition-transform duration-500 transform ${activeSection === "hostManagement"
                  ? "scale-105 bg-blue-300"
                  : "hover:bg-blue-100 hover:scale-105 active:bg-blue-100 active:scale-105"
                  }`}
                onClick={() => setActiveSection("hostManagement")}
              >
                Host Management
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 transition-all duration-300 ease-in-out relative">
        <button
          onClick={handleLogout}
          className="absolute top-5 right-5 bg-blue-400 text-white px-4 py-1 rounded transition hover:bg-blue-600 flex items-center" // Add flex to align items
        >
          <AiOutlineLogout className="mr-2 text-black" /> {/* Add the icon with margin to the right */}
          Logout
        </button>
        <h1 className="text-2xl font-bold">{renderHeading()}</h1>
        <div className="mt-5 animate-fade-in">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
