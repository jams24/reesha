const path = require('path');
const fs = require('fs').promises;

const uploadDir = path.join(__dirname, '../../uploads');
const uploadUrlPrefix = '/uploads';

function getUploadUrl(file) {
  return `${uploadUrlPrefix}/${file.filename}`;
}

async function destroyByUrl(url) {
  try {
    if (!url.startsWith(uploadUrlPrefix)) return;
    const filename = path.basename(url);
    const filePath = path.join(uploadDir, filename);
    await fs.unlink(filePath);
  } catch (err) {
    console.warn('Failed to delete image:', err.message);
  }
}

module.exports = { uploadBuffer: getUploadUrl, destroyByUrl };
