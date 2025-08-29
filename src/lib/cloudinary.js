// cloudinary.js
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getUploadUrl = () => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Missing env NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
};

export const uploadImage = async (file) => {
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Missing env NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(getUploadUrl(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};