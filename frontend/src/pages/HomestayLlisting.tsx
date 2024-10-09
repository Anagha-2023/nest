import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomestays } from '../store/slices/userSlice';

const HomestayListing: React.FC = () => {
  const dispatch = useDispatch();
  const { homestays, homestayLoading, homestayError } = useSelector((state: any) => state.user);
  
  useEffect(() => {
    dispatch(fetchHomestays() as any);
  }, [dispatch]);

  if (homestayLoading) {
    return <div>Loading...</div>;
  }

  if (homestayError) {
    return <div>Error: {homestayError}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {homestays.length > 0 ? (
        homestays.map((homestay) => {
          // Normalize the image path
          const imagePath = homestay.image.startsWith('C:') 
            ? homestay.image.split('backend')[1] // Extract the relative path
            : homestay.image.replace(/\\/g, '/'); // Replace backslashes

          const imageUrl = `http://localhost:5000${imagePath}`;

          return (
            <div key={homestay._id} className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={imageUrl}
                alt={homestay.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{homestay.name}</h3>
                <p className="text-gray-600">{homestay.country}</p>
                <p className="text-gray-800">${homestay.pricePerNight}/night</p>
                <p className="text-gray-500">{homestay.rooms} rooms</p>
                <p className="text-gray-700">{homestay.description}</p>
                {homestay.offerPercentage && (
                  <p className="text-red-500">Offer: {homestay.offerPercentage}% off</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div>No homestays available</div>
      )}
    </div>
  );
};

export default HomestayListing;
