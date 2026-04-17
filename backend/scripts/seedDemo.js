require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const Product = require('../src/models/Product');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'admin@reesha.local';
  const password = 'reesha123';
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, name: 'Reesha' },
    { upsert: true, new: true }
  );
  console.log(`Admin: ${email} / ${password}`);

  await Product.deleteMany({});

  const demoProducts = [
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
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      stock: 1,
    },
    {
      name: 'Black Bum Shorts',
      description: 'Fitted high-waist bum shorts in stretch denim. A versatile staple for every closet.',
      price: 6500,
      category: 'bum-shorts',
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      stock: 2,
    },
    {
      name: 'Ivory Maxi Skirt',
      description: 'Flowy floor-length maxi skirt in ivory linen blend. Elastic waist, lightweight and breezy.',
      price: 11000,
      category: 'maxi-skirts',
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      ],
      featured: true,
      stock: 1,
    },
    {
      name: 'Oversized Vintage Tee — Graphic',
      description: 'Hand-picked oversized graphic tee. Soft, well-worn, the perfect layering piece.',
      price: 5500,
      category: 'imported',
      sizes: ['M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
      stock: 3,
    },
    {
      name: 'Imported Satin Midi Skirt',
      description: 'Silky satin midi in deep olive. Smooth drape, side zip. Imported.',
      price: 14000,
      category: 'imported',
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
      stock: 1,
    },
    {
      name: 'Wide-Leg Baggy Jeans — Light Wash',
      description: 'Light-wash baggy jeans with a relaxed wide leg and raw hem finish.',
      price: 13000,
      category: 'baggy-jeans',
      sizes: ['26', '28', '30'],
      images: [
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
      stock: 1,
    },
    {
      name: 'Distressed Denim Jorts',
      description: 'Medium-wash jorts with subtle distressing. Mid-rise, sits just above the knee.',
      price: 7500,
      category: 'jorts',
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80',
      ],
      featured: false,
      stock: 1,
    },
  ];

  for (const p of demoProducts) {
    const doc = new Product(p);
    await doc.save();
    console.log(`  + ${doc.name} (/${doc.slug})`);
  }

  console.log(`\nSeeded ${demoProducts.length} products.`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
