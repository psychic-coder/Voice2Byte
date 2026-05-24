import axios from 'axios';

// /**
//  * Uploads a file to Cloudinary
//  * @param {File} file - The file to upload
//  * @param {Object} options - Additional options
//  * @param {string} options.uploadPreset - Cloudinary upload preset
//  * @param {string} options.cloudName - Cloudinary cloud name
//  * @param {function} [options.onProgress] - Progress callback
//  * @returns {Promise<string>} - The secure URL of the uploaded file
//  */
export const UploadImage = async (file, options) => {
  const { uploadPreset, cloudName, onProgress } = options;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        } : undefined,
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};