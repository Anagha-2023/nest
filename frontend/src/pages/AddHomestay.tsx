import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHomestay } from '../store/slices/hosthomestaySlice';
import { RootState } from '../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'; // Icons for adding/removing

const countries = [
  'India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Italy',
  'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Russia', 'South Africa'
];

const AddHomestayForm: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    pricePerNight: 0,
    rooms: 0,
    description: '',
    cancellationPeriod: 0,
    offerPercentage: 0,
    services: [{ name: 'WiFi', available: false }], // Initial service
  });
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fileErrors, setFileErrors] = useState<{ mainImage?: string; additionalImages?: string }>({}); // File type errors
  const [showSuccess, setShowSuccess] = useState(false);

  const { status, error } = useSelector((state: RootState) => state.homestay);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleServiceChange = (index: number, field: string, value: string | boolean) => {
  //   const updatedServices = formData.services.map((service, i) =>
  //     i === index ? { ...service, [field]: value } : service
  //   );
  //   setFormData({ ...formData, services: updatedServices });
  // };

  // const addService = () => {
  //   setFormData({
  //     ...formData,
  //     services: [...formData.services, { name: '', available: false }],
  //   });
  // };

  // const removeService = (index: number) => {
  //   const updatedServices = formData.services.filter((_, i) => i !== index);
  //   setFormData({ ...formData, services: updatedServices });
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      const fileType = selectedImage.type;
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

      if (!validTypes.includes(fileType)) {
        setFileErrors({ ...fileErrors, mainImage: 'File type not supported. Only choose jpeg, jpg, png, or gif.' });
        setImage(null);
      } else {
        setFileErrors({ ...fileErrors, mainImage: '' });
        setImage(selectedImage);
      }
    }
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const invalidImages = selectedImages.filter((img) => !validTypes.includes(img.type));

      if (invalidImages.length > 0) {
        setFileErrors({ ...fileErrors, additionalImages: 'File type not supported. Only choose jpeg, jpg, png, or gif.' });
        setImages([]);
      } else {
        setFileErrors({ ...fileErrors, additionalImages: '' });
        setImages(selectedImages);
      }
    }
  };

  const removeMainImage = () => {
    setImage(null);
    (document.querySelector('input[name="image"]') as HTMLInputElement).value = '';
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.pricePerNight <= 0) newErrors.pricePerNight = 'Price per Night must be greater than 0';
    if (formData.rooms <= 0) newErrors.rooms = 'Number of Rooms must be greater than 0';
    if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (formData.cancellationPeriod < 0) newErrors.cancellationPeriod = 'Cancellation Period cannot be negative';
    if (formData.offerPercentage < 0) newErrors.offerPercentage = 'Offer Percentage cannot be negative';
    
    if (!image) {
      newErrors.image = 'Main image is required';
    }
    if (images.length === 0) {
      newErrors.additionalImages = 'At least one additional image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const homestayData = new FormData();
      homestayData.append('name', formData.name);
      homestayData.append('country', formData.country);
      homestayData.append('pricePerNight', formData.pricePerNight.toString());
      homestayData.append('rooms', formData.rooms.toString());
      homestayData.append('description', formData.description);
      homestayData.append('cancellationPeriod', formData.cancellationPeriod.toString());
      homestayData.append('offerPercentage', formData.offerPercentage.toString());
      // homestayData.append('services', JSON.stringify(formData.services)); // Append services as a JSON string
      if (image) homestayData.append('image', image); // Main image
      images.forEach((img) => homestayData.append('images', img)); // Additional images

      dispatch(addHomestay(homestayData) as any);
      console.log("Homestay adding action is dispatched.");
    }
  };

  useEffect(() => {
    if (status === 'succeeded') {
      setShowSuccess(true);
      setFormData({
        name: '',
        country: '',
        pricePerNight: 0,
        rooms: 0,
        description: '',
        cancellationPeriod: 0,
        offerPercentage: 0,
        services: [{ name: 'WiFi', available: false }], // Reset services
      });
      setImage(null);
      setImages([]);
      
      // Clear the file input fields
      (document.querySelector('input[name="image"]') as HTMLInputElement).value = '';
      (document.querySelector('input[name="images"]') as HTMLInputElement).value = '';
  
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="p-6 pt-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      {showSuccess && (
        <div className='fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg '>
          Homestay added successfully!
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-blue-500 text-center">Add Your Homestay</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-4 rounded-md">
            {/* Homestay Name */}
            <label className="block mb-1">Homestay Name</label>
            {errors.name && <p className="text-red-500">{errors.name}</p>}
            <input
              type="text"
              name="name"
              placeholder="Homestay Name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            />

            {/* Country */}
            <label className="block mb-1 mt-4">Country</label>
            {errors.country && <p className="text-red-500">{errors.country}</p>}
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Price per Night */}
            <label className="block mb-1 mt-4">Price per Night (₹)</label>
            {errors.pricePerNight && <p className="text-red-500">{errors.pricePerNight}</p>}
            <input
              type="number"
              name="pricePerNight"
              placeholder="Price per Night"
              value={formData.pricePerNight}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            />

            {/* Rooms */}
            <label className="block mb-1 mt-4">Rooms</label>
            {errors.rooms && <p className="text-red-500">{errors.rooms}</p>}
            <input
              type="number"
              name="rooms"
              placeholder="Number of Rooms"
              value={formData.rooms}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            />

            
            {/* Cancellation Period */}
            <label className="block mb-1 mt-4">Cancellation Period (Days)</label>
            {errors.cancellationPeriod && <p className="text-red-500">{errors.cancellationPeriod}</p>}
            <input
              type="number"
              name="cancellationPeriod"
              placeholder="Cancellation Period"
              value={formData.cancellationPeriod}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            />

            {/* Services
            <label className="block mb-1 mt-4">Services</label>
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  className="input-field p-2 w-full border border-gray-300 rounded-md"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={service.available}
                    onChange={(e) => handleServiceChange(index, 'available', e.target.checked)}
                  />
                  <span>Available</span>
                </label>
                <button type="button" onClick={() => removeService(index)}>
                  <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="mt-4 flex items-center text-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Service
            </button>*/}
          </div> 

          <div className="bg-blue-100 p-4 rounded-md">
            {/* Description */}
            <label className="block mb-1">Description</label>
            {errors.description && <p className="text-red-500">{errors.description}</p>}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            ></textarea>

            

            {/* Offer Percentage */}
            <label className="block mb-1 mt-4">Offer Percentage</label>
            {errors.offerPercentage && <p className="text-red-500">{errors.offerPercentage}</p>}
            <input
              type="number"
              name="offerPercentage"
              placeholder="Offer Percentage"
              value={formData.offerPercentage}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            />

            {/* Image upload and preview */}

            {/* Main Image */}
            <label className="block mb-1 mt-4">Main Image</label>
            {errors.image && <p className="text-red-500">{errors.image}</p>}
            {fileErrors.mainImage && <p className="text-red-500">{fileErrors.mainImage}</p>}
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="input-field w-full border border-gray-300 rounded-md"
            />
            {image && (
              <div className="relative mt-2 w-28 h-28">
                <img src={URL.createObjectURL(image)} alt="Main Preview" className="object-cover w-full h-full rounded-md" />
                <button
                  onClick={removeMainImage}
                  className="absolute top-0 right-0 text-white bg-red-500 p-1 rounded-full"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Additional Images */}
            <label className="block mb-1 mt-4">Additional Images</label>
            {errors.additionalImages && <p className="text-red-500">{errors.additionalImages}</p>}
            {fileErrors.additionalImages && <p className="text-red-500">{fileErrors.additionalImages}</p>}
            <input
              type="file"
              name="images"
              onChange={handleMultipleImagesChange}
              accept="image/*"
              multiple
              className="input-field w-full border border-gray-300 rounded-md"
            />

            <div className="grid grid-cols-5 gap-1 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative w-16 h-16">
                  <img src={URL.createObjectURL(img)} alt={`Additional Preview ${index}`} className="object-cover w-full h-full rounded-md" />
                  <button
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-0 right-0 text-white bg-red-500 p-1 rounded-full"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Submit button */}
        <div className='flex justify-center'>
        <button type="submit" className="w-2/3 bg-blue-500 text-white p-4 rounded-md mt-6">
          Submit
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default AddHomestayForm;
