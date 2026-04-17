const mongoose = require('mongoose');
const slugify = require('slugify');

const CATEGORIES = ['baggy-jeans', 'bum-shorts', 'jorts', 'maxi-skirts', 'imported', 'other'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, default: 'other', index: true },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 1, min: 0 },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

productSchema.pre('validate', async function generateSlug(next) {
  if (!this.isModified('name') && this.slug) return next();
  const base = slugify(this.name, { lower: true, strict: true });
  let candidate = base;
  let n = 1;
  while (await mongoose.models.Product.findOne({ slug: candidate, _id: { $ne: this._id } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  this.slug = candidate;
  next();
});

productSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Product', productSchema);
