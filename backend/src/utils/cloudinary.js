const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'reesha', resource_type: 'image' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });
}

async function destroyByUrl(url) {
  try {
    if (!url || !url.includes('cloudinary.com')) return;
    // Extract public_id from URL: .../reesha/filename.ext → reesha/filename
    const match = url.match(/\/([^/]+\/[^/]+)\.\w+$/);
    if (match) await cloudinary.uploader.destroy(match[1]);
  } catch (err) {
    console.warn('Cloudinary delete failed:', err.message);
  }
}

module.exports = { uploadBuffer, destroyByUrl };
