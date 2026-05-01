const prisma = require('../config/db');
const { uploadBuffer } = require('../utils/cloudinary');

const ALLOWED_KEYS = [
  'category_image_baggy-jeans',
  'category_image_bum-shorts',
  'category_image_jorts',
  'category_image_maxi-skirts',
  'category_image_imported',
  'instagram_handle',
  'instagram_image_0',
  'instagram_image_1',
  'instagram_image_2',
  'instagram_image_3',
  'instagram_image_4',
  'instagram_image_5',
];

exports.list = async (req, res) => {
  const settings = await prisma.setting.findMany();
  const obj = {};
  settings.forEach((s) => { obj[s.key] = s.value; });
  res.json(obj);
};

exports.upsert = async (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_KEYS.includes(key)) return res.status(400).json({ error: 'Unknown setting key' });

  let value = req.body.value;

  if (req.file) {
    const upload = await uploadBuffer(req.file.buffer);
    value = upload.secure_url;
  }

  if (!value) return res.status(400).json({ error: 'value or file required' });

  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  res.json(setting);
};
