const cloudinary = require('cloudinary').v2;

function isConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function uploadBuffer(buffer, folder = 'reesha/products') {
  if (!isConfigured()) {
    const err = new Error('Image uploads are disabled — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    err.status = 503;
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function destroyByUrl(url) {
  if (!isConfigured()) return;
  try {
    const parts = url.split('/');
    const idx = parts.indexOf('reesha');
    if (idx === -1) return;
    const fileWithExt = parts.slice(idx).join('/');
    const publicId = fileWithExt.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('cloudinary destroy failed:', err.message);
  }
}

module.exports = { cloudinary, uploadBuffer, destroyByUrl, isConfigured };
