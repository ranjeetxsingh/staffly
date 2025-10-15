// utils/uploadToCloudinary.js
const cloudinary = require("./cloudnary");

const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "events", // optional folder in cloudinary
  });
};

const uploadMultipleToCloudinary = async (files) => {
  const uploads = files.map(file => uploadToCloudinary(file.path));
  return await Promise.all(uploads);
};

module.exports = { uploadToCloudinary, uploadMultipleToCloudinary };
