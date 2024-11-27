import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomestays } from '../store/slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faSearch, faFilter, faUserCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const CategoryIcons = {
  All: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  PoolView: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 15c2.483 0 4.345-1.068 5-2 .655 1.068 2.517 2 5 2s4.345-1.068 5-2c.655 1.068 2.517 2 5 2" />
      <rect x="3" y="8" width="18" height="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <path d="M3 19h18" />
    </svg>
  ),
  AmazingView: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
      <path d="M12 15v6" />
      <path d="M9 15l3-3 3 3" />
    </svg>
  ),
  TreeHouse: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 13V3L4 9h16z" />
      <path d="M12 22v-8" />
      <path d="M4 9v10h16V9" />
      <path d="M16 16h2" />
      <path d="M6 16h2" />
    </svg>
  ),
  Lakeside: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 13.5L12 3l9 10.5" />
      <path d="M5 13.5l7-7 7 7" />
      <path d="M3 20.5L12 10l9 10.5" />
    </svg>
  ),
  BeachFront: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M17.5 7.5L12 2" />
      <path d="M12 2L6.5 7.5" />
      <path d="M3 12l9-9 9 9" />
      <path d="M12 22V12" />
      <path d="M3 20l18-8" />
    </svg>
  ),
  Rooms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 16V8" />
      <path d="M17 16V8" />
    </svg>
  ),
  Luxe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 10l-2.5-2.5" />
      <path d="M14 10l2.5-2.5" />
      <path d="M12 20v-8" />
      <path d="M3 7l9-4 9 4" />
      <path d="M12 3v18" />
    </svg>
  ),
  Mansions: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 20V6.5a3.5 3.5 0 1 1 7 0V20" />
      <path d="M10 11h4" />
      <path d="M4 21V10.5a3.5 3.5 0 1 1 7 0V21" />
      <path d="M4 11h4" />
    </svg>
  ),
  Farms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 14l4-4 4 4" />
      <path d="M3 20v-5h18v5" />
      <path d="M12 20V8l-3-3H3v9" />
      <path d="M15 20V8l3-3h6v9" />
      <path d="M12 13h2" />
    </svg>
  ),
  Castles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M22 20V10l-5-5-5 5v10z" />
      <path d="M2 20V10l5-5 5 5v10z" />
      <path d="M12 15v4" />
      <path d="M7 15h10" />
      <path d="M12 11V7" />
    </svg>
  ),
  CountrySide: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 20v-6h4v6" />
      <path d="M4 10l8-8 8 8" />
      <path d="M6 18h12" />
      <path d="M16 10v8" />
      <path d="M8 10v8" />
    </svg>
  ),
  Camping: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 13L2 22h20L12 13z" />
      <path d="M12 22V3l8 9" />
      <path d="M12 13l-8 9" />
      <path d="M12 3l4 5" />
      <path d="M12 3l-4 5" />
    </svg>
  ),
  Islands: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
      <path d="M3 13c2.5 0 4.5-2 4.5-4.5S5.5 4 3 4" />
      <path d="M21 13c-2.5 0-4.5-2-4.5-4.5S18.5 4 21 4" />
      <path d="M12 22v-8" />
    </svg>
  )
};

const HomestayListing: React.FC = () => {
  const dispatch = useDispatch();
  const { homestays, homestayLoading, homestayError } = useSelector((state: any) => state.user);

  // State for liked homestays and mobile menu toggle
  const [likedHomestays, setLikedHomestays] = useState<{ [key: string]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showfilterOption, setShowfilterOption] = useState(false);
  const [showPriceOptions, setShowPriceOptions] = useState(false);
  const [showRoomOptions, setshowRoomOptions] = useState(false);
  const [priceSortOrder, setPriceSortOrder] = useState<'lowToHigh' | 'highToLow' | null>(null);
  const [roomFilter, setRoomFilter] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!homestays.length) {
      dispatch(fetchHomestays() as any);
    }
  }, [dispatch, homestays.length]);


  const toggleLike = (homestayId: string) => {
    setLikedHomestays((prevState) => ({
      ...prevState,
      [homestayId]: !prevState[homestayId],
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handlePriceSort = (order: 'lowToHigh' | 'highToLow') => {
    setPriceSortOrder(order);
    setShowPriceOptions(false);
  }

  const handleRoomFilter = (rooms: number | null) => {
    setRoomFilter(rooms);
    setshowRoomOptions(false);
  }

  const toggleFilterOption = () => setShowfilterOption(!showfilterOption);
  const togglePriceOptions = () => setShowPriceOptions(!showPriceOptions);
  const toggleRoomOptions = () => setshowRoomOptions(!showRoomOptions)

  const filteredHomestays = homestays
    .filter((homestay) =>
      homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      homestay.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((homestay) => {
      // If no category is selected or "All" is selected, show all homestays
      if (!selectedCategory || selectedCategory === 'All') {
        return true;
      }

      console.log('Homestay Category:', homestay.category?.name);
      console.log('Selected Category:', selectedCategory);

      return homestay.category?.name === selectedCategory || homestay.categoryName === selectedCategory;
    })
    .filter((homestay) => {
      if (roomFilter === null) return true;
      if (roomFilter === 5) return homestay.rooms === 5;
      if (roomFilter === -1) return homestay.rooms < 5;
      if (roomFilter === 6) return homestay.rooms > 5;
    })
    .sort((a, b) => {
      if (priceSortOrder === 'lowToHigh') return a.pricePerNight - b.pricePerNight;
      if (priceSortOrder === 'highToLow') return b.pricePerNight - a.pricePerNight;
      return 0;
    });

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
    <div className="bg-blue-200 min-h-screen">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Header with logo and navigation */}
        <header className="flex items-center justify-between px-6 py-4 mb-8 ">
          {/* User Icon */}

          <div className="absolute top-6 right-5 flex items-center justify-center w-10 h-10 rounded-full  bg-gray-50 shadow-md hover:cursor-pointer shadow-gray-700">
            <FontAwesomeIcon icon={faUserCircle} className="text-gray-900 text-2xl" />
          </div>

          <div className="flex items-center w-full lg:justify-start">
            <img src="../src/assets/images/logo_black.png" alt="Logo" className="w-24" />

            {/* Hamburger Icon for Mobile */}
            <button className="lg:hidden ml-auto mr-9" onClick={toggleMobileMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>




            {/* Navigation Links */}
            <nav className="hidden lg:flex space-x-8 ml-96 text-gray-800 text-base">
              <a href="#" className="hover:border-b-2 border-blue-500">Home</a>
              <a href="#about" className="hover:border-b-2 border-blue-500">Explore</a>
              <a href="#contact" className="hover:border-b-2 border-blue-500">Contact us</a>
              <a href="#about" className="hover:border-b-2 border-blue-500">About us</a>
              <a href="#host" className="hover:border-b-2 border-blue-500">Become a host</a>
            </nav>
          </div>

          {/* Mobile Menu Links */}
          {isMobileMenuOpen && (
            <div className="lg:hidden w-1/3 bg-white bg-opacity-95  shadow-lg absolute rounded-xl top-16 right-12 z-10">
              <nav className="flex flex-col items-center py-4 space-y-4 text-blue-900 text-base font-semibold ">
                <a href="#" onClick={toggleMobileMenu} className=' flex justify-center hover:underline underline-offset-4 w-2/3 hover:scale-105'>Home</a>
                <a href="#about" onClick={toggleMobileMenu} className=' flex justify-center hover:underline underline-offset-4 w-2/3 hover:scale-105'>Explore</a>
                <a href="#contact" onClick={toggleMobileMenu} className=' flex justify-center hover:underline underline-offset-4 w-2/3 hover:scale-105'>Contact us</a>
                <a href="#about" onClick={toggleMobileMenu} className=' flex justify-center hover:underline underline-offset-4 w-2/3 hover:scale-105'>About us</a>
                <a href="#host" onClick={toggleMobileMenu} className=' flex justify-center hover:underline underline-offset-4 w-2/3 hover:scale-105'>Become a host</a>
              </nav>
            </div>
          )}
        </header>

        {/* Search bar */}
        <div className='flex justify-between items-center mb-10 w-full'>
          <div className="flex-grow flex items-center justify-center">
            <div className="relative w-4/5 mx-auto">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-950" />
              <input
                className="pl-12 pt-3 pb-3 rounded-full bg-blue-50 bg-opacity-80 w-full shadow-md shadow-gray-500 focus:shadow-lg focus:shadow-gray-500  text-gray-950 placeholder-gray-400 font-medium focus:outline-none"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search here by name and country..."
              />
            </div>
          </div>

          {/*Filter Functionality*/}
          <div className="flex justify-end ml-auto">
            <button onClick={toggleFilterOption} className="pl-5 pr-5 pt-2 pb-2 bg-blue-100 rounded-full shadow-md shadow-gray-500 flex items-center space-x-2 hover:shadow-md hover:shadow-gray-500">
              <div className='hover:font-medium'>
                <FontAwesomeIcon icon={faFilter} className="text-gray-950" />
                <span className="text-gray-950 ml-2">Filter</span>
              </div>
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-4">
          <div className="flex space-x-14 justify-center pb-4 pl-3">
            {Object.keys(CategoryIcons).map((category) => {
              const IconComponent = CategoryIcons[category];
              return (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center cursor-pointer transform transition-all duration-150 hover:scale-110 hover:border-b-2 hover:border-b-black hover:text-black hover:font-bold ${selectedCategory === category ? 'text-blue-600 scale-110' : 'text-gray-700'
                    }`}
                >
                  <IconComponent />
                  <span className="text-xs font-medium mt-2">{category}</span>
                </div>
              );
            })}
          </div>
        </div>


        {showfilterOption && (
          <div className='absolute right-6 top-40 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
            <div className='p-2'>
              <span
                className=' hover:text-sky-900 font-semibold text-gray-700 cursor-pointer'
                onClick={togglePriceOptions}
              >
                Price
              </span>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showPriceOptions ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <ul className='mt-2 space-y-1'>
                  <li onClick={() => handlePriceSort('lowToHigh')} className='p-2 hover:bg-sky-100 hover:rounded-sm hover:font-medium hover:text-sky-900 hover:cursor-pointer'>
                    Low to high
                  </li>
                  <li onClick={() => handlePriceSort('highToLow')} className='pt-0 p-2 hover:bg-sky-100 hover:rounded-sm hover:font-medium hover:text-sky-900 hover:cursor-pointer'>
                    High to low
                  </li>
                </ul>
              </div>
            </div>

            <div className='p-2'>
              <span
                className='hover:text-sky-900 font-semibold text-gray-700 cursor-pointer'
                onClick={toggleRoomOptions}
              >
                No. of Rooms
              </span>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showRoomOptions ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <ul className="mt-2 space-y-1">
                  <li onClick={() => handleRoomFilter(null)} className="p-2 hover:bg-sky-100 hover:text-sky-900 hover:cursor-pointer hover:font-medium">All</li>
                  <li onClick={() => handleRoomFilter(5)} className="p-2 hover:bg-sky-100 hover:text-sky-900 hover:cursor-pointer hover:font-medium">5</li>
                  <li onClick={() => handleRoomFilter(-1)} className="p-2 hover:bg-sky-100 hover:text-sky-900 hover:cursor-pointer hover:font-medium">&lt;5</li>
                  <li onClick={() => handleRoomFilter(6)} className="p-2 hover:bg-sky-100 hover:text-sky-900 hover:cursor-pointer hover:font-medium">&gt;5</li>
                </ul>

              </div>
            </div>
          </div>
        )}

        {/* Homestay Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredHomestays.length > 0 ? (
            filteredHomestays.map((homestay) => {
              const imagePath = homestay.image.startsWith('C:')
                ? homestay.image.split('backend')[1] : homestay.image.replace(/\\/g, '/');
              const imageUrl = `http://localhost:5000${imagePath}`;

              return (
                <div key={homestay._id} className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105">
                  {homestay.offerPercentage && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {homestay.offerPercentage}% off
                    </div>
                  )}
                  <img src={imageUrl} alt={homestay.name} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex justify-between">
                      {homestay.name}
                      <FontAwesomeIcon
                        icon={likedHomestays[homestay._id] ? solidHeart : regularHeart}
                        onClick={() => toggleLike(homestay._id)}
                        className={`cursor-pointer ${likedHomestays[homestay._id] ? 'text-red-500' : 'text-gray-500'} hover:scale-125`}
                      />
                    </h3>
                    <p className="text-gray-600">{homestay.country}</p>
                    <p className="text-gray-900 font-bold">${homestay.pricePerNight}/night</p>
                    <p className="text-gray-500">{homestay.rooms} rooms</p>
                    <p className="text-gray-700 text-sm truncate">{homestay.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-700">No homestays available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomestayListing;
