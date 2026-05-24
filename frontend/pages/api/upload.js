import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dammvsknw",
  api_key: "747399427821421",
  api_secret: "IuI6LocB4xDmluM18Wp9S3snfm4",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: 'ml_default', // Required for unsigned uploads // Organize images in Cloudinary      // Force a specific filename (optional)
        allowed_formats: ['jpg', 'png', 'webp'], // Restrict file type
      });

    return res.status(200).json(uploadedResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Error uploading image' });
  }
}