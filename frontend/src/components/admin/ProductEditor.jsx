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
  const [imageUrls, setImageUrls] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
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
      setImageUrls(product.images || []);
    } else {
      setForm(emptyForm());
      setImageUrls([]);
    }
    setNewFiles([]);
    setUrlInput('');
    setShowUrlInput(false);
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

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError('Image URL must start with http:// or https://');
      return;
    }
    if (imageUrls.includes(url)) {
      setError('That URL is already added.');
      return;
    }
    setError('');
    setImageUrls((arr) => [...arr, url]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const removeUrl = (url) => setImageUrls((arr) => arr.filter((u) => u !== url));
  const removeNew = (idx) => setNewFiles((arr) => arr.filter((_, i) => i !== idx));

  const moveUrl = (from, to) => {
    setImageUrls((arr) => {
      const copy = [...arr];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || form.price === '') {
      setError('Name and price are required.');
      return;
    }
    if (imageUrls.length === 0 && newFiles.length === 0) {
      setError('Please add at least one image (paste a URL or upload a file).');
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
        data.append('keepImages', JSON.stringify(imageUrls));
      } else {
        data.append('imageUrls', JSON.stringify(imageUrls));
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
              <div className="flex items-end justify-between mb-2">
                <label className="eyebrow">Images (up to 8)</label>
                <p className="text-[11px] text-neutral-500">{imageUrls.length + newFiles.length}/8</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imageUrls.map((url, i) => (
                  <div key={url} className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = '0.3'; }} />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-ink text-paper text-[9px] uppercase tracking-widest2 px-1.5 py-0.5">Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeUrl(url)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-7 h-7 bg-paper/95 flex items-center justify-center border border-neutral-200"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveUrl(i, 0)}
                        title="Make cover"
                        className="absolute top-1 left-1 text-[9px] uppercase tracking-widest2 bg-paper/95 border border-neutral-200 px-1.5 py-0.5 hover:bg-ink hover:text-paper"
                      >
                        ★
                      </button>
                    )}
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
              </div>

              {showUrlInput ? (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    autoFocus
                    placeholder="https://i.imgur.com/..."
                    className="input flex-1"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addUrl(); }
                      if (e.key === 'Escape') { setShowUrlInput(false); setUrlInput(''); }
                    }}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={addUrl} className="btn-primary flex-1 sm:flex-none">Add</button>
                    <button type="button" onClick={() => { setShowUrlInput(false); setUrlInput(''); }} className="btn-outline flex-1 sm:flex-none">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 border border-dashed border-neutral-300 px-4 py-3 text-[11px] uppercase tracking-widest2 text-neutral-600 text-center cursor-pointer hover:border-ink hover:text-ink transition min-h-[44px] flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload file
                    <input type="file" accept="image/*" multiple hidden onChange={onFileChange} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="flex-1 border border-dashed border-neutral-300 px-4 py-3 text-[11px] uppercase tracking-widest2 text-neutral-600 text-center hover:border-ink hover:text-ink transition min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Paste image URL
                  </button>
                </div>
              )}

              <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
                Paste a public image URL (right-click any image → "Copy image address"), or upload a file. The first image is the cover — use ★ to change which image is first.
              </p>
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
