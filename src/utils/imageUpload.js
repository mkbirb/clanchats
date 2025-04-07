import axios from 'axios';

export const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    // Make HTTP Requests to the IMGBB Image Hosting API
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=01f74317cb7efadf84db4d80064e034c`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Get the image URL from the response
    const imageUrl = response.data.data.url;

    // Return the image URL
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw new Error('Failed to upload image');
  }
};
