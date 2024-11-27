import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/adminSlice";
import UserManagement from "./UserManagement";
import HostManagement from "./HostManagement";
import CategoryManagement from "../host/CategoryManagement";
import { AiOutlineLogout } from "react-icons/ai";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "userManagement" | "hostManagement" | "categories">("dashboard");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
        return <h2 className="flex justify-center text-3xl font-semibold text-gray-700">Welcome to the Admin Dashboard!</h2>;
      case "userManagement":
        return <UserManagement />;
      case "hostManagement":
        return <HostManagement />;
      case "categories":
        return <CategoryManagement />;
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
      case "categories":
        return "Category Management";
      default:
        return "Admin Dashboard";
    }
  };

  // Handle logout functionality
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    await dispatch(logout() as any);
    navigate("/admin-login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-blue-200 p-4">
        {/* Logo */}
        <div className="mb-8">
          <img src="../src/assets/images/logo_black.png" alt="Logo" className="absolute top-5 left-5 w-20" />
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-20">
          <ul className="space-y-8">
            <li>
              <button
                className={`block text-gray-700 font-semibold p-2 ${activeSection === "dashboard" ? "bg-blue-300" : ""}`}
                onClick={() => setActiveSection("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`block text-gray-700 font-semibold p-2 ${activeSection === "userManagement" ? "bg-blue-300" : ""}`}
                onClick={() => setActiveSection("userManagement")}
              >
                User Management
              </button>
            </li>
            <li>
              <button
                className={`block text-gray-700 font-semibold p-2 ${activeSection === "hostManagement" ? "bg-blue-300" : ""}`}
                onClick={() => setActiveSection("hostManagement")}
              >
                Host Management
              </button>
            </li>
            <li>
              <button
                className={`block text-gray-700 font-semibold p-2 ${activeSection === "categories" ? "bg-blue-300" : ""}`}
                onClick={() => setActiveSection("categories")}
              >
                Category Management
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 relative">
        <button
          onClick={handleLogout}
          className="absolute top-5 right-5 bg-blue-400 text-white px-4 py-1 rounded flex items-center hover:bg-blue-600"
        >
          <AiOutlineLogout className="mr-2" />
          Logout
        </button>
        <h1 className="text-2xl font-bold">{renderHeading()}</h1>
        <div className="mt-5">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
