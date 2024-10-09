import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomestays, updateHomestay } from "../store/slices/hosthomestaySlice";
import Spinner from "../components/Spinner";

const YourHomestays: React.FC = () => {
  const dispatch = useDispatch();
  const { homestays, status, error } = useSelector((state: any) => state.homestay);

  const [editingHomestayId, setEditingHomestayId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHomestays() as any);
  }, [dispatch]);

  if (status === "loading") return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  const handleEditClick = (homestay: any) => {
    setEditingHomestayId(homestay._id);
    setFormData({
      name: homestay.name,
      country: homestay.country,
      pricePerNight: homestay.pricePerNight,
      description: homestay.description,
      rooms: homestay.rooms,
      offerPercentage: homestay.offerPercentage,
      cancellationPeriod: homestay.cancellationPeriod,
    });
    setMainImage(null);
    setAdditionalImages([]);
    setExistingImages(homestay.images || []); // Store existing images
    setRemovedImages([]);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMainImage(e.target.files[0]); // Update main image
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAdditionalImages(filesArray); // Update additional images
    }
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setRemovedImages([...removedImages, imageToRemove]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImage(null);
  };

  const removeNewImage = (index: number) => {
    setAdditionalImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedDetails = {
      name: formData.name,
      country: formData.country,
      pricePerNight: formData.pricePerNight,
      description: formData.description,
      rooms: formData.rooms,
      offerPercentage: formData.offerPercentage,
      cancellationPeriod: formData.cancellationPeriod,
      mainImage: mainImage ? mainImage : undefined,
      additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
      removedImages: removedImages.length > 0 ? removedImages : undefined,
    };

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("id", editingHomestayId as string);
    formDataToSubmit.append("updatedDetails", JSON.stringify(updatedDetails));

    if (mainImage) {
      formDataToSubmit.append("mainImage", mainImage);
    }

    if (additionalImages.length > 0) {
      additionalImages.forEach((image) => {
        formDataToSubmit.append("additionalImages", image);
      });
    }

    if (removedImages.length > 0) {
      formDataToSubmit.append("removedImages", JSON.stringify(removedImages));
    }

    dispatch(updateHomestay(formDataToSubmit) as any);
    setEditingHomestayId(null);
    setIsModalOpen(false);
  };

  const getImageUrl = (imagePath: string) => {
    return imagePath ? `http://localhost:5000/uploads/${imagePath.split('\\').pop()}` : "/default-image.jpg";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.isArray(homestays) &&
        homestays.map((homestay: any) => (
          <div key={homestay._id} className="bg-white rounded-lg shadow-lg p-4">
            <img
              src={getImageUrl(homestay.image)}
              alt={homestay.name}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e: any) => {
                e.target.src = "/default-image.jpg";
              }}
            />
            <h3 className="text-lg font-semibold mt-2">{homestay.name}</h3>
            <p>{homestay.country}</p>
            <p>${homestay.pricePerNight} per night</p>
            <p>{homestay.description}</p>
            <p>{homestay.rooms} rooms</p>
            <p>Offer: {homestay.offerPercentage}%</p>
            <p>Cancellation Period: {homestay.cancellationPeriod}</p>
            <button
              onClick={() => handleEditClick(homestay)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Homestay</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Form fields with labels */}
              <label className="block text-sm mb-2 font-medium" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Name"
                required
              />

              <label className="block font-medium text-sm mb-2" htmlFor="country">
                Country
              </label>
              <select
                name="country"
                id="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              >
                <option value="">Select a country</option>
                {/* Sample list of countries */}
                <option value="USA">India</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">USA</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Brazil">Brazil</option>
                <option value="Japan">Japan</option>
                <option value="South Africa">South Africa</option>
                {/* Add more countries as needed */}
              </select>

              <label className="block mb-2 text-sm  font-medium " htmlFor="pricePerNight">
                Price per Night
              </label>
              <input
                type="number"
                name="pricePerNight"
                id="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Price per Night"
                required
              />

              <label className="block font-medium  text-sm  mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Description"
                required
              />

              <label className="block font-medium text-sm mb-2" htmlFor="rooms">
                Rooms
              </label>
              <input
                type="number"
                name="rooms"
                id="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Number of Rooms"
                required
              />

              <label className="block font-medium text-sm mb-2" htmlFor="offerPercentage">
                Offer Percentage
              </label>
              <input
                type="number"
                name="offerPercentage"
                id="offerPercentage"
                value={formData.offerPercentage}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Offer Percentage"
                required
              />

              <label className="block font-medium text-sm mb-2" htmlFor="cancellationPeriod">
                Cancellation Period
              </label>
              <input
                type="text"
                name="cancellationPeriod"
                id="cancellationPeriod"
                value={formData.cancellationPeriod}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Cancellation Period"
                required
              />

              <div className="mb-4">
                <label className="block font-medium text-sm mb-2" htmlFor="mainImage">
                  Main Image
                </label>
                {mainImage && (
                  <div className="flex items-center justify-between mt-2">
                    <img src={URL.createObjectURL(mainImage)} alt="Main" className="h-24 object-cover" />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-sm mb-2" htmlFor="additionalImages">
                  Additional Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {additionalImages.map((image, index) => (
                  <div key={index} className="flex items-center justify-between mt-2">
                    <img src={URL.createObjectURL(image)} alt={`Additional ${index + 1}`} className="h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                {existingImages.length > 0 ? (
                  existingImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between mt-2">
                      <img src={getImageUrl(image)} alt={`Existing ${index + 1}`} className="h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No existing images.</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Homestay
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourHomestays;
