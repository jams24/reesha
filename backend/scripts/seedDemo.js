require('dotenv').config();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const prisma = require('../src/config/db');

const DEMO_PRODUCTS = [
  {
    name: 'Vintage Baggy Denim — Dark Wash',
    description: 'Classic 90s baggy fit in rich indigo denim. High-rise, wide leg, lightly distressed hem. One-of-one thrift find.',
    price: 12500,
    category: 'baggy-jeans',
    sizes: ['28', '30', '32'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    stock: 1,
  },
  {
    name: 'Cream Cargo Jorts',
    description: 'Knee-length cream cargo jorts with utility pockets. Perfect for easy summer styling.',
    price: 8000,
    category: 'jorts',
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    stock: 1,
  },
  {
    name: 'Black Bum Shorts',
    description: 'Fitted high-waist bum shorts in stretch denim. A versatile staple for every closet.',
    price: 6500,
    category: 'bum-shorts',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    stock: 2,
  },
  {
    name: 'Ivory Maxi Skirt',
    description: 'Flowy floor-length maxi skirt in ivory linen blend. Elastic waist, lightweight and breezy.',
    price: 11000,
    category: 'maxi-skirts',
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    stock: 1,
  },
  {
    name: 'Oversized Vintage Tee — Graphic',
    description: 'Hand-picked oversized graphic tee. Soft, well-worn, the perfect layering piece.',
    price: 5500,
    category: 'imported',
    sizes: ['M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    stock: 3,
  },
  {
    name: 'Imported Satin Midi Skirt',
    description: 'Silky satin midi in deep olive. Smooth drape, side zip. Imported.',
    price: 14000,
    category: 'imported',
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    stock: 1,
  },
  {
    name: 'Wide-Leg Baggy Jeans — Light Wash',
    description: 'Light-wash baggy jeans with a relaxed wide leg and raw hem finish.',
    price: 13000,
    category: 'baggy-jeans',
    sizes: ['26', '28', '30'],
    images: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    stock: 1,
  },
  {
    name: 'Distressed Denim Jorts',
    description: 'Medium-wash jorts with subtle distressing. Mid-rise, sits just above the knee.',
    price: 7500,
    category: 'jorts',
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    stock: 1,
  },
];

function makeSlug(name, used) {
  const base = slugify(name, { lower: true, strict: true }) || 'item';
  let candidate = base;
  let n = 1;
  while (used.has(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  used.add(candidate);
  return candidate;
}

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set in .env');
    process.exit(1);
  }

  const email = 'admin@reesha.local';
  const password = 'reesha123';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: 'Reesha' },
    create: { email, passwordHash, name: 'Reesha' },
  });
  console.log(`Admin: ${email} / ${password}`);

  await prisma.product.deleteMany({});
  const used = new Set();
  for (const p of DEMO_PRODUCTS) {
    const slug = makeSlug(p.name, used);
    const created = await prisma.product.create({ data: { ...p, slug } });
    console.log(`  + ${created.name} (/${created.slug})`);
  }

  console.log(`\nSeeded ${DEMO_PRODUCTS.length} products.`);
  await prisma.$disconnect();
  process.exit(0);
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
