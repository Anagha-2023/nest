import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600">
      <h1 className="text-9xl font-bold text-white animate-bounce">404</h1>
      <h2 className="text-4xl font-semibold text-white mt-4">Page Not Found</h2>
      <p className="text-lg text-white mt-2">Sorry, the page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-6 inline-block px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-purple-100 transition-all duration-300"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
