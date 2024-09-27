import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen relative">
      {/* Spinning Circle */}
      <div className="absolute w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
  );
};

export default Spinner;
