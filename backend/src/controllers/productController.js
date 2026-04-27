const slugify = require('slugify');
const prisma = require('../config/db');
const { uploadBuffer, destroyByUrl } = require('../utils/cloudinary');

const CATEGORIES = ['baggy-jeans', 'bum-shorts', 'jorts', 'maxi-skirts', 'imported', 'other'];

function parseSizes(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}

function parseJSONArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

function coerceBool(v) {
  return v === true || v === 'true';
}

function normalizeCategory(c) {
  return CATEGORIES.includes(c) ? c : 'other';
}

async function buildUniqueSlug(name, excludeId) {
  const base = slugify(name, { lower: true, strict: true }) || 'item';
  let candidate = base;
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

exports.list = async (req, res) => {
  const { category, size, minPrice, maxPrice, search, featured, limit = 48, page = 1 } = req.query;
  const where = {};
  if (category && category !== 'all') where.category = category;
  if (size) where.sizes = { has: size };
  if (coerceBool(featured)) where.featured = true;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const lim = Math.min(Number(limit) || 48, 100);
  const skip = (Math.max(Number(page), 1) - 1) * lim;

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: lim }),
    prisma.product.count({ where }),
  ]);

  res.json({ items, total, page: Number(page), limit: lim });
};

exports.getBySlug = async (req, res) => {
  const item = await prisma.product.findUnique({ where: { slug: req.params.slug } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.create = async (req, res) => {
  const { name, description = '', price, featured = false, stock = 1 } = req.body;
  if (!name || price === undefined) return res.status(400).json({ error: 'name and price are required' });

  const sizes = parseSizes(req.body.sizes);
  const category = normalizeCategory(req.body.category || 'other');

  const imageUrls = parseJSONArray(req.body.imageUrls);
  if (req.files?.length) {
    imageUrls.push(...req.files.map((f) => uploadBuffer(f)));
  }

  const slug = await buildUniqueSlug(name);

  const cryptoPriceUsd = req.body.cryptoPriceUsd !== undefined && req.body.cryptoPriceUsd !== ''
    ? Number(req.body.cryptoPriceUsd)
    : null;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      cryptoPriceUsd,
      category,
      sizes,
      stock: Number(stock),
      featured: coerceBool(featured),
      images: imageUrls,
    },
  });

  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const data = {};
  if (req.body.name !== undefined && req.body.name !== existing.name) {
    data.name = req.body.name;
    data.slug = await buildUniqueSlug(req.body.name, existing.id);
  }
  if (req.body.description !== undefined) data.description = req.body.description;
  if (req.body.price !== undefined) data.price = Number(req.body.price);
  if (req.body.cryptoPriceUsd !== undefined) {
    data.cryptoPriceUsd = req.body.cryptoPriceUsd === '' || req.body.cryptoPriceUsd === null
      ? null
      : Number(req.body.cryptoPriceUsd);
  }
  if (req.body.category !== undefined) data.category = normalizeCategory(req.body.category);
  if (req.body.stock !== undefined) data.stock = Number(req.body.stock);
  if (req.body.featured !== undefined) data.featured = coerceBool(req.body.featured);
  if (req.body.sizes !== undefined) data.sizes = parseSizes(req.body.sizes);

  let images = existing.images;
  if (req.body.keepImages !== undefined) {
    const keep = parseJSONArray(req.body.keepImages);
    const removed = existing.images.filter((u) => !keep.includes(u));
    await Promise.all(removed.map((u) => destroyByUrl(u)));
    images = keep;
  }

  if (req.files?.length) {
    images = [...images, ...req.files.map((f) => uploadBuffer(f))];
  }
  data.images = images;

  const updated = await prisma.product.update({ where: { id: existing.id }, data });
  res.json(updated);
};

exports.setStock = async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const inStock = req.body.inStock === true || req.body.inStock === 'true';
  const updated = await prisma.product.update({
    where: { id: existing.id },
    data: { stock: inStock ? 1 : 0 },
  });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await Promise.all(existing.images.map((u) => destroyByUrl(u)));
  await prisma.product.delete({ where: { id: existing.id } });
  res.json({ ok: true });
};
