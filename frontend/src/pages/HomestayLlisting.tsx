import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomestays } from '../store/slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const HomestayListing: React.FC = () => {
  const dispatch = useDispatch();
  const { homestays, homestayLoading, homestayError } = useSelector((state: any) => state.user);

  // A state to track the liked homestays
  const [likedHomestays, setLikedHomestays] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(fetchHomestays() as any);
  }, [dispatch]);

  const toggleLike = (homestayId: string) => {
    setLikedHomestays((prevState) => ({
      ...prevState,
      [homestayId]: !prevState[homestayId], // Toggle the like status
    }));
  };

  if (homestayLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (homestayError) {
    return <div>Error: {homestayError}</div>;
  }

  return (
    <div className="bg-blue-200 min-h-screen"> {/* Added blue background */}
      <div className="container mx-auto py-4">
        {/* Header with logo and navigation */}
        <header className="w-full flex items-center justify-between px-6 py-4 mb-8"> 
          <div className="flex items-center">
            {/* Logo */}
            <img
              src="../src/assets/images/logo_black.png" // Add your logo path here
              alt="Logo"
              className="w-24 mr-96"
            />
            {/* Navigation Links */}
            <nav className="flex space-x-14 text-gray-800 text-base">
              <a href="#" className="hover:border-b-2 hover:scale-105 hover:border-blue-500 hover:text-gray-700 hover:font-medium">Home</a>
              <a href="#about" className="hover:border-b-2 hover:scale-105 hover:border-blue-500 hover:text-gray-700 hover:font-medium">Explore</a>
              <a href="#contact" className="hover:border-b-2 hover:scale-105 hover:border-blue-500 hover:text-gray-700 hover:font-medium">Contact us</a>
              <a href="#contact" className="hover:border-b-2 hover:scale-105 hover:border-blue-500 hover:text-gray-700 hover:font-medium">About us</a>
              <a href="#contact" className="hover:border-b-2 hover:scale-105 hover:border-blue-500 hover:text-gray-700 hover:font-medium">Become a host</a>
            </nav>
          </div>
        </header>

        {/* Homestay Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-9 ">
          {homestays.length > 0 ? (
            homestays.map((homestay) => {
              // Normalize the image path
              const imagePath = homestay.image.startsWith('C:')
                ? homestay.image.split('backend')[1] // Extract the relative path
                : homestay.image.replace(/\\/g, '/'); // Replace backslashes

              const imageUrl = `http://localhost:5000${imagePath}`;

              return (
                <div key={homestay._id} className="relative transition hover:scale-105 rounded-lg overflow-hidden shadow-lg bg-gray-100 shadow-gray-600">
                  {/* Offer Badge */}
                  {homestay.offerPercentage && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                      {homestay.offerPercentage}% off
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={homestay.name}
                    className="w-full h-40 object-cover transition hover:scale-105" // Adjusted height
                  />
                  <div className="p-3 space-y-2 relative"> {/* Reduced padding */}
                    <h3 className="text-lg font-semibold text-gray-800 flex justify-between">
                      {homestay.name}
                      {/* Heart icon for like */}
                      <FontAwesomeIcon
                        icon={likedHomestays[homestay._id] ? solidHeart : regularHeart}
                        onClick={() => toggleLike(homestay._id)}
                        className={`cursor-pointer transition ${likedHomestays[homestay._id] ? 'text-red-500' : 'text-gray-500'} hover:scale-125`}
                      />
                    </h3>
                    <p className="text-gray-600">{homestay.country}</p>
                    <p className="text-gray-900 font-bold">${homestay.pricePerNight}/night</p>
                    <p className="text-gray-500">{homestay.rooms} rooms</p>
                    <p className="text-gray-700 text-sm font-semibold truncate">{homestay.description}</p> {/* Text truncate for consistency */}
                  </div>
                </div>
              );
            })
          ) : (
            <div>No homestays available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomestayListing;
