// backend/services/uploadService.js
const cloudinary = require('../config/cloudinary');

const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Extract public_id from a full Cloudinary URL if that's what you store
    // Example: "https://res.cloudinary.com/cloudname/image/upload/v123456/folder/myimage.png"
    // Public ID would be "folder/myimage"
    const publicIdParts = publicId.split('/');
    const folderAndFileName = publicIdParts.slice(publicIdParts.length - 2).join('/').split('.')[0];

    const result = await cloudinary.uploader.destroy(`artbloom/${folderAndFileName}`); // Assuming 'artbloom' is your main folder
    console.log('Cloudinary delete result:', result);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image with public ID: ${publicId}`);
    }
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  deleteImageFromCloudinary,
  // You can add more Cloudinary related functions here, e.g., fetching details, transformations
};