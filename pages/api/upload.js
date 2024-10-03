import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../lib/cloudinary'; // Import Cloudinary config

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cv_uploads', // Folder name on Cloudinary
    // Allowed file formats
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

// Disable bodyParser for handling multipart data (used by multer)
export const config = {
  api: {
    bodyParser: false,
  },
};

// The actual API route handler for file upload
const handler = async (req, res) => {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Multer middleware for handling single file upload
  upload.single('cv')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // If upload was successful, return the Cloudinary file URL
      return res.status(200).json({ url: req.file.path });
    } catch (uploadError) {
      console.error('Error during file processing:', uploadError);
      return res.status(500).json({ error: 'Error during file processing' });
    }
  });
};

export default handler;
