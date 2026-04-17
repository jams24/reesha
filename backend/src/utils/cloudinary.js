const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function uploadBuffer(buffer, folder = 'reesha/products') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function destroyByUrl(url) {
  try {
    const parts = url.split('/');
    const fileWithExt = parts.slice(parts.indexOf('reesha')).join('/');
    const publicId = fileWithExt.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('cloudinary destroy failed:', err.message);
  }
}

module.exports = { cloudinary, uploadBuffer, destroyByUrl };
