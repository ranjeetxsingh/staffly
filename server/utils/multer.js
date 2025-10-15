const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    try {
      const extension = path.extname(file.originalname);
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${extension}`);
    } catch (error) {
      console.error("Filename generation error:", error);
      cb(error);
    }
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowed = allowedTypes.test(extension);

  if (isAllowed) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file type: ${extension}. Only jpeg, jpg, png, webp allowed.`);
    console.error("File filter error:", error.message);
    cb(error);
  }
};

// Multer setup
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter,
});

module.exports = upload
