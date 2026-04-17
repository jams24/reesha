const Product = require('../models/Product');
const { uploadBuffer, destroyByUrl } = require('../utils/cloudinary');

function parseSizes(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

exports.list = async (req, res) => {
  const { category, size, minPrice, maxPrice, search, featured, limit = 48, page = 1 } = req.query;
  const query = {};
  if (category && category !== 'all') query.category = category;
  if (size) query.sizes = size;
  if (featured === 'true') query.featured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.name = { $regex: search, $options: 'i' };

  const lim = Math.min(Number(limit) || 48, 100);
  const skip = (Math.max(Number(page), 1) - 1) * lim;

  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(lim),
    Product.countDocuments(query),
  ]);

  res.json({ items, total, page: Number(page), limit: lim });
};

exports.getBySlug = async (req, res) => {
  const item = await Product.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = async (req, res) => {
  const { name, description = '', price, category = 'other', featured = false, stock = 1 } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'name and price are required' });

  const sizes = parseSizes(req.body.sizes);

  let imageUrls = [];
  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));
    imageUrls = uploads.map((u) => u.secure_url);
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    category,
    sizes,
    stock: Number(stock),
    featured: featured === true || featured === 'true',
    images: imageUrls,
  });

  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });

  const { name, description, price, category, stock, featured } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);
  if (featured !== undefined) product.featured = featured === true || featured === 'true';
  if (req.body.sizes !== undefined) product.sizes = parseSizes(req.body.sizes);

  if (req.body.keepImages !== undefined) {
    const keep = parseSizes(req.body.keepImages);
    const removed = product.images.filter((u) => !keep.includes(u));
    await Promise.all(removed.map((u) => destroyByUrl(u)));
    product.images = keep;
  }

  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));
    product.images.push(...uploads.map((u) => u.secure_url));
  }

  await product.save();
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  await Promise.all(product.images.map((u) => destroyByUrl(u)));
  await product.deleteOne();
  res.json({ ok: true });
};
