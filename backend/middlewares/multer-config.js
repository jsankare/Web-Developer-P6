// Import multer module for handling file uploads
const multer = require('multer');

// Define MIME types for image files
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Configure multer to store uploaded image files in the public/images directory
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/images');
  },
  filename: (request, file, callback) => {
    // Generate a unique filename for the uploaded image file
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});

// Export a single-file upload middleware that uses the configured multer storage settings
module.exports = multer({
  storage
}).single('image');