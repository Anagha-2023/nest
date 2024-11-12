import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface ImageCropperProps {
  imageFile: File;
  show: boolean;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageFile,
  show,
  onCropComplete,
  onCancel
}) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const cropperInstanceRef = useRef<Cropper | null>(null);

  useEffect(() => {
    if (show && cropperRef.current) {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
      }

      cropperInstanceRef.current = new Cropper(cropperRef.current, {
        aspectRatio: 16 / 9,
        viewMode: 1,
        autoCropArea: 1,
      });
    }

    return () => {
      if (cropperInstanceRef.current) {
        cropperInstanceRef.current.destroy();
        cropperInstanceRef.current = null;
      }
    };
  }, [show]);

  const handleCropComplete = () => {
    if (!cropperInstanceRef.current) return;

    cropperInstanceRef.current.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return;

      const croppedFile = new File([blob], 'cropped_image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      onCropComplete(croppedFile);
    }, 'image/jpeg');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Crop Image</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <img
            ref={cropperRef}
            src={URL.createObjectURL(imageFile)}
            alt="Image to crop"
            className="max-w-full"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;