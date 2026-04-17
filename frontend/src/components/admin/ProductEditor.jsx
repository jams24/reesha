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

      const productId = product?._id || product?.id;
      const saved = editing
        ? await updateProduct(productId, data)
        : await createProduct(data);

      onSaved(saved, editing);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="bg-paper w-full sm:max-w-2xl sm:my-8 relative flex flex-col min-h-screen sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-paper flex items-center justify-between px-5 sm:px-8 py-4 border-b border-neutral-200">
          <div>
            <p className="eyebrow">{editing ? 'Edit' : 'New'}</p>
            <p className="font-serif text-lg sm:text-xl mt-0.5">{editing ? 'Edit product' : 'Add product'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-neutral-500 hover:text-ink min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="eyebrow block mb-2">Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              <div>
                <label className="eyebrow block mb-2">Price (₦)</label>
                <input className="input" type="number" inputMode="numeric" min="0" step="50" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                {form.price !== '' && <p className="text-[11px] text-neutral-500 mt-1">{formatNaira(form.price)}</p>}
              </div>

              <div>
                <label className="eyebrow block mb-2">Category</label>
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="eyebrow block mb-2">Stock</label>
                <input className="input" type="number" inputMode="numeric" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>

              <div className="flex items-center sm:items-end">
                <label className="flex items-center gap-3 text-sm cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-5 h-5 accent-black"
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
                <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-2">Images (up to 8)</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {keepImages.map((url) => (
                  <div key={url} className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExisting(url)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-7 h-7 bg-paper/95 flex items-center justify-center border border-neutral-200"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                ))}
                {newFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-ink text-paper text-[9px] uppercase tracking-widest2 px-1.5 py-0.5">New</span>
                    <button
                      type="button"
                      onClick={() => removeNew(i)}
                      aria-label="Remove new image"
                      className="absolute top-1 right-1 w-7 h-7 bg-paper/95 flex items-center justify-center border border-neutral-200"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                ))}
                <label className="aspect-square border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-widest2 text-neutral-500 cursor-pointer hover:border-ink hover:text-ink transition">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add
                  <input type="file" accept="image/*" multiple hidden onChange={onFileChange} />
                </label>
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">First image is the cover. Images upload to Cloudinary on save.</p>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm px-4 py-3">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-paper border-t border-neutral-200 p-4 sm:p-5 flex gap-3 safe-bottom">
          <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
}
