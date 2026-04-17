import { useEffect, useState } from 'react';
import { createProduct, updateProduct } from '../../lib/api.js';
import { formatNaira } from '../../lib/whatsapp.js';

const CATEGORY_OPTIONS = [
  { value: 'baggy-jeans', label: 'Baggy jeans' },
  { value: 'bum-shorts', label: 'Bum shorts' },
  { value: 'jorts', label: 'Jorts' },
  { value: 'maxi-skirts', label: 'Maxi skirts' },
  { value: 'imported', label: 'Imported' },
  { value: 'other', label: 'Other' },
];

function emptyForm() {
  return {
    name: '',
    description: '',
    price: '',
    category: 'baggy-jeans',
    sizes: '',
    stock: 1,
    featured: false,
  };
}

export default function ProductEditor({ open, product, onClose, onSaved }) {
  const editing = !!product;
  const [form, setForm] = useState(emptyForm());
  const [keepImages, setKeepImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        category: product.category || 'other',
        sizes: (product.sizes || []).join(', '),
        stock: product.stock ?? 1,
        featured: !!product.featured,
      });
      setKeepImages(product.images || []);
    } else {
      setForm(emptyForm());
      setKeepImages([]);
    }
    setNewFiles([]);
    setError('');
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files].slice(0, 8));
    e.target.value = '';
  };

  const removeExisting = (url) => setKeepImages((arr) => arr.filter((u) => u !== url));
  const removeNew = (idx) => setNewFiles((arr) => arr.filter((_, i) => i !== idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || form.price === '') {
      setError('Name and price are required.');
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', String(form.price));
      data.append('category', form.category);
      data.append('stock', String(form.stock || 0));
      data.append('featured', form.featured ? 'true' : 'false');
      data.append('sizes', form.sizes);

      if (editing) {
        data.append('keepImages', JSON.stringify(keepImages));
      }
      newFiles.forEach((f) => data.append('images', f));

      const saved = editing
        ? await updateProduct(product._id, data)
        : await createProduct(data);

      onSaved(saved, editing);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="bg-paper w-full max-w-2xl my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="p-8 sm:p-10 space-y-6">
          <div>
            <p className="eyebrow">{editing ? 'Edit' : 'New'}</p>
            <h2 className="section-title mt-1">{editing ? 'Edit product' : 'Add product'}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="eyebrow block mb-2">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label className="eyebrow block mb-2">Price (₦)</label>
              <input className="input" type="number" min="0" step="50" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              {form.price !== '' && <p className="text-[11px] text-neutral-500 mt-1">Displayed as {formatNaira(form.price)}</p>}
            </div>

            <div>
              <label className="eyebrow block mb-2">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="eyebrow block mb-2">Stock</label>
              <input className="input" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-black"
                />
                Feature on homepage
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="eyebrow block mb-2">Sizes (comma-separated)</label>
              <input className="input" placeholder="e.g. S, M, L  or  28, 30, 32" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
            </div>

            <div className="sm:col-span-2">
              <label className="eyebrow block mb-2">Description</label>
              <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="eyebrow block mb-2">Images (up to 8)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {keepImages.map((url) => (
                <div key={url} className="relative aspect-square bg-neutral-100 overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExisting(url)} className="absolute top-1 right-1 bg-paper/90 text-xs px-2 py-0.5 border border-neutral-300 opacity-0 group-hover:opacity-100">
                    Remove
                  </button>
                </div>
              ))}
              {newFiles.map((file, i) => (
                <div key={i} className="relative aspect-square bg-neutral-100 overflow-hidden group">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-ink text-paper text-[10px] px-2 py-0.5">New</span>
                  <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 bg-paper/90 text-xs px-2 py-0.5 border border-neutral-300 opacity-0 group-hover:opacity-100">
                    Remove
                  </button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-neutral-300 flex items-center justify-center text-[11px] uppercase tracking-widest2 text-neutral-500 cursor-pointer hover:border-ink hover:text-ink transition">
                + Add
                <input type="file" accept="image/*" multiple hidden onChange={onFileChange} />
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </div>
      </form>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
