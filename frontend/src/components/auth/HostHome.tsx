// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
import AddHomestayForm from "../../pages/AddHomestay";
import YourHomestays from "../../pages/YourHomestays";

const HostHome: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading ,setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate a delay (you can replace this with actual API calls)
    return () => clearTimeout(timer);
  }, []);


  // Function to render the active section content
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <h2 className="flex justify-center text-3xl font-semibold text-gray-700">Welcome to the Dashboard!</h2>;
      case "addhomestays":
        return <AddHomestayForm/> // Use the separated UserManagement component
      case "yourhomestays":
        return <YourHomestays/>
      default:
        return null;
    }
  };

  const renderHeading = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "addhomestays":
        return "Add Homestays";
      case "yourhomestays":
        return "Your homestays"
      default:
        return "Admin Dashboard";
    }
  };

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 h-screen bg-blue-200 p-4">
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
                className={`block text-gray-700 font-semibold p-2 ${
                  activeSection === "dashboard" ? "bg-blue-100" : ""
                }`}
                onClick={() => setActiveSection("dashboard")}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-gray-700 font-semibold p-2 ${
                  activeSection === "addhomestays" ? "bg-blue-100" : ""
                }`}
                onClick={() => setActiveSection("addhomestays")}
              >
                Add Homestays
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`block text-gray-700 font-semibold p-2 ${
                  activeSection === "yourhomestays" ? "bg-blue-100" : ""
                }`}
                onClick={() => setActiveSection("yourhomestays")}
              >
                Your Homestays
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold">{renderHeading()}</h1>
        {loading ? (
          <Spinner/>
        ) : (
          <div className="mt-5">{renderContent()}</div>
        )}
      </div>
    </div>
  );
};

export default HostHome;
