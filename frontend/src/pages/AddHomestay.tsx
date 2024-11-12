import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHomestay, resetSuccess } from '../store/slices/hosthomestaySlice';
import { RootState, AppDispatch } from '../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCrop } from '@fortawesome/free-solid-svg-icons';
import ImageCropper from '../components/ImageCropper';

const countries = [
  'India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Italy',
  'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Russia', 'South Africa'
];

const initialServices = [
  {name:'WiFi', available:true},
  {name:'Air Conditioning', available:true}
]

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
    services: initialServices,
  });

  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fileErrors, setFileErrors] = useState<{ mainImage?: string; additionalImages?: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newService, setNewService] = useState('');

  // Cropping states
  const [cropperData, setCropperData] = useState<{
    show: boolean;
    image: File | null;
    isMain: boolean;
    index: number | null;
  }>({
    show: false,
    image: null,
    isMain: false,
    index: null,
  });

  const { status, error, success } = useSelector((state: RootState) => state.homestay);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   // Add a new custom service
   const handleAddService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, { name: newService, available: true }],
      });
      setNewService('');
    }
  };

  // Function to toggle service availability
  const handleServiceChange = (index: number) => {
    const updatedServices = formData.services.map((service, i) =>
      i === index ? { ...service, available: !service.available } : service
    );
    setFormData({ ...formData, services: updatedServices });
  };

  const handleCropComplete = (croppedFile: File) => {
    if (cropperData.isMain) {
      setImage(croppedFile);
    } else if (cropperData.index !== null) {
      const newImages = [...images];
      newImages[cropperData.index] = croppedFile;
      setImages(newImages);
    }
    setCropperData({ show: false, image: null, isMain: false, index: null });
  };

  const startCropping = (isMain: boolean, index?: number) => {
    const imageFile = isMain ? image : (index !== undefined ? images[index] : null);
    if (!imageFile) return;

    setCropperData({
      show: true,
      image: imageFile,
      isMain,
      index: index ?? null,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      if (validateImage(selectedImage, 'mainImage')) {
        setImage(selectedImage);
        startCropping(true);
      }
    }
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validImages = selectedImages.filter(img => validateImage(img, 'additionalImages'));

      if (validImages.length > 0) {
        setImages(validImages);
        startCropping(false, 0);
      }
    }
  };

  const validateImage = (file: File, type: 'mainImage' | 'additionalImages'): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      setFileErrors(prev => ({ ...prev, [type]: 'File type not supported. Only choose jpeg, jpg, png, or gif.' }));
      return false;
    }

    if (file.size > maxSize) {
      setFileErrors(prev => ({ ...prev, [type]: 'File too large. Maximum size is 5MB.' }));
      return false;
    }

    setFileErrors(prev => ({ ...prev, [type]: '' }));
    return true;
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

    if (!image) newErrors.image = 'Main image is required';
    if (images.length === 0) newErrors.additionalImages = 'At least one additional image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      try {
        const homestayData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if(key === "services" && Array.isArray(value)) {
            homestayData.append(key, JSON.stringify(value));
          }
          else if (typeof value === 'object' && !Array.isArray(value)) {
            homestayData.append(key, JSON.stringify(value));
          } else {
            homestayData.append(key, value.toString());
          }
        });

        if (image) homestayData.append('image', image);
        images.forEach((img) => homestayData.append('images', img));

        await dispatch(addHomestay(homestayData) as any);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (success) {
      setFormData({
        name: '',
        country: '',
        pricePerNight: 0,
        rooms: 0,
        description: '',
        cancellationPeriod: 0,
        offerPercentage: 0,
        services: [{ name: 'WiFi', available: false }],
      });
      setImage(null);
      setImages([]);

      (document.querySelector('input[name="image"]') as HTMLInputElement).value = '';
      (document.querySelector('input[name="images"]') as HTMLInputElement).value = '';

      const timer = setTimeout(()=>{
        dispatch(resetSuccess());
      },3000);
      return () => clearTimeout(timer)
    }
  }, [success]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(URL.createObjectURL(image));
      images.forEach(img => URL.revokeObjectURL(URL.createObjectURL(img)));
    };
  }, [image, images]);

  return (
    <div className="p-6 pt-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          Homestay added successfully!
        </div>
      )}
  
      {cropperData.show && cropperData.image && (
        <ImageCropper
          imageFile={cropperData.image}
          show={cropperData.show}
          onCropComplete={handleCropComplete}
          onCancel={() =>
            setCropperData({ show: false, image: null, isMain: false, index: null })
          }
        />
      )}
  
      <h2 className="text-2xl font-semibold mb-4 text-blue-500 text-center">Add Your Homestay</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-4 rounded-md">
            {/* Basic Information */}
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
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
  
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
          </div>
  
          <div className="bg-blue-100 p-4 rounded-md">
            <label className="block mb-1">Description</label>
            {errors.description && <p className="text-red-500">{errors.description}</p>}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field p-4 w-full border border-gray-300 rounded-md"
            ></textarea>
  
            
  
            {/* Services Section */}
            <label className="block mb-1 mt-4">Services</label>
            <div className="grid grid-cols-2 gap-2">
              {formData.services.map((service, index) => (
                <label key={service.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={service.available}
                    onChange={() => handleServiceChange(index)}
                    className="mr-2"
                  />
                  {service.name}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a new service"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="w-full mt-2 border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={handleAddService}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Service
            </button>
  
            {/* Main Image Upload Section */}
            <label className="block mb-1 mt-4">Main Image</label>
            {errors.image && <p className="text-red-500">{errors.image}</p>}
            {fileErrors.mainImage && <p className="text-red-500">{fileErrors.mainImage}</p>}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field w-full mt-2"
            />
            {image && (
              <div className="relative mt-2 w-32 h-32">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Main Image"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-2 right-1 p-1 pl-2 pr-2 bg-red-600 text-white rounded-full"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <button
                  type="button"
                  onClick={() => startCropping(true)}
                  className="absolute top-2 right-9 p-1 bg-gray-800 pl-2 pr-2 text-white rounded-full"
                >
                  <FontAwesomeIcon icon={faCrop} />
                </button>
              </div>
            )}
  
            {/* Additional Images Upload Section */}
            <label className="block mb-1 mt-4">Additional Images</label>
            {errors.additionalImages && <p className="text-red-500">{errors.additionalImages}</p>}
            {fileErrors.additionalImages && <p className="text-red-500">{fileErrors.additionalImages}</p>}
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesChange}
              className="input-field w-full mt-2"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Additional Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-2 right-1 p-1 pl-2 pr-2 bg-red-600 text-white rounded-full"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <button
                    type="button"
                    onClick={() => startCropping(false, index)}
                    className="absolute top-2 right-9 p-1 pl-2 pr-2 bg-gray-800 text-white rounded-full"
                  >
                    <FontAwesomeIcon icon={faCrop} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          disabled={isProcessing}
        >
          {isProcessing ? 'Adding Homestay...' : 'Add Homestay'}
        </button>
      </form>
    </div>
  );
}

export default AddHomestayForm;
