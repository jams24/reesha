import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProducts, deleteProduct, setProductStock, fetchSettings, updateCategoryImage } from '../lib/api.js';
import { formatNaira } from '../lib/whatsapp.js';
import ProductEditor from '../components/admin/ProductEditor.jsx';

const CATEGORY_SLUGS = [
  { slug: 'baggy-jeans', label: 'Baggy Jeans' },
  { slug: 'bum-shorts', label: 'Bum Shorts' },
  { slug: 'jorts', label: 'Jorts' },
  { slug: 'maxi-skirts', label: 'Maxi Skirts' },
  { slug: 'imported', label: 'Imported' },
];

const TILE_DEFAULTS = {
  'baggy-jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  'bum-shorts': 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80',
  'jorts': 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80',
  'maxi-skirts': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
  'imported': 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
};

function CategoryImageCard({ slug, label, currentUrl, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const save = async ({ file, url }) => {
    if (!file && !url) return;
    setSaving(true);
    try {
      const result = await updateCategoryImage(`category_image_${slug}`, { file, url });
      onSaved(slug, result.value);
      setEditing(false);
      setUrlInput('');
    } catch (e) {
      alert('Failed to save image: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-neutral-200 overflow-hidden">
      <div className="relative aspect-[3/4] bg-neutral-100">
        <img src={currentUrl} alt={label} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditing((e) => !e); setUrlInput(''); }}
            className="bg-paper text-ink px-4 py-2 text-[11px] uppercase tracking-widest2 font-medium hover:bg-neutral-100"
          >
            {editing ? 'Cancel' : 'Change image'}
          </button>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-neutral-100">
        <p className="text-xs font-medium">{label}</p>
      </div>
      {editing && (
        <div className="border-t border-neutral-200 p-3 space-y-2 bg-neutral-50">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={saving}
            className="w-full border border-neutral-300 py-2 text-[11px] uppercase tracking-widest2 hover:bg-white disabled:opacity-50"
          >
            {saving ? 'Uploading…' : 'Upload photo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) save({ file: f }); e.target.value = ''; }}
          />
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Or paste image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 border border-neutral-300 px-2 py-1.5 text-xs focus:outline-none focus:border-ink"
            />
            <button
              onClick={() => save({ url: urlInput.trim() })}
              disabled={saving || !urlInput.trim()}
              className="px-3 py-1.5 bg-ink text-paper text-[11px] uppercase tracking-widest2 disabled:opacity-40"
            >
              Use
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryImages, setCategoryImages] = useState(TILE_DEFAULTS);

  const load = async () => {
    setLoading(true);
    try {
      const [data, settings] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchSettings().catch(() => ({})),
      ]);
      setProducts(data.items || []);
      const merged = { ...TILE_DEFAULTS };
      Object.entries(settings).forEach(([k, v]) => {
        const slug = k.replace('category_image_', '');
        if (merged[slug] !== undefined) merged[slug] = v;
      });
      setCategoryImages(merged);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const onNew = () => { setEditing(null); setEditorOpen(true); };
  const onEdit = (p) => { setEditing(p); setEditorOpen(true); };

  const onDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This also removes its images.`)) return;
    const id = p._id || p.id;
    await deleteProduct(id);
    setProducts((arr) => arr.filter((x) => (x._id || x.id) !== id));
  };

  const onToggleStock = async (p) => {
    const id = p._id || p.id;
    const inStock = p.stock === 0;
    const updated = await setProductStock(id, inStock);
    setProducts((arr) => arr.map((x) => ((x._id || x.id) === id ? updated : x)));
  };

  const onCategoryImageSaved = (slug, value) => {
    setCategoryImages((prev) => ({ ...prev, [slug]: value }));
  };

  const onSaved = (saved, wasEditing) => {
    const savedId = saved._id || saved.id;
    setProducts((arr) => {
      if (wasEditing) return arr.map((x) => ((x._id || x.id) === savedId ? saved : x));
      return [saved, ...arr];
    });
    setEditorOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-paper/95 backdrop-blur">
        <div className="container-x h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif italic text-xl sm:text-2xl">Reesha</span>
            <span className="text-[10px] uppercase tracking-widest2 text-neutral-500">Admin</span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="text-neutral-500 text-xs truncate max-w-[200px]">{admin?.email}</span>
            <Link to="/admin/orders" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink">Orders</Link>
            <Link to="/" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink">View store</Link>
            <button onClick={logout} className="text-[11px] uppercase tracking-widest2 hover:text-neutral-500">Sign out</button>
          </div>

          {/* Mobile menu */}
          <button
            className="sm:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Account menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18"/> : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t border-neutral-200 bg-paper">
            <div className="container-x py-4 space-y-2">
              <p className="text-xs text-neutral-500 truncate">{admin?.email}</p>
              <Link to="/admin/orders" onClick={() => setMenuOpen(false)} className="block py-2 text-sm uppercase tracking-widest2 text-neutral-500">Orders</Link>
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm uppercase tracking-widest2 text-neutral-500">View store</Link>
              <button onClick={logout} className="block py-2 text-sm uppercase tracking-widest2 text-left w-full">Sign out</button>
            </div>
          </div>
        )}
      </header>

      <div className="container-x py-6 sm:py-10">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div>
            <p className="eyebrow">Inventory</p>
            <h1 className="section-title mt-1">Products</h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {loading ? 'Loading…' : `${filtered.length}${search ? ` of ${products.length}` : ''} products`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="input flex-1"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={onNew} className="btn-primary whitespace-nowrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-500 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 px-4">
            <p className="eyebrow mb-3">{search ? 'No matches' : 'No products yet'}</p>
            <p className="text-sm text-neutral-600">
              {search ? 'Try a different search.' : 'Tap "New product" to add your first item.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <ul className="md:hidden space-y-3">
              {filtered.map((p) => {
                const id = p._id || p.id;
                return (
                  <li key={id} className="bg-white border border-neutral-200 p-3 flex gap-3">
                    <div className="w-20 h-24 bg-neutral-100 overflow-hidden flex-shrink-0">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium leading-tight line-clamp-2">{p.name}</h3>
                        {p.featured && <span className="text-[10px] text-ink" title="Featured">★</span>}
                      </div>
                      <p className="text-[10px] uppercase tracking-widest2 text-neutral-500 mt-1">
                        {p.category?.replace('-', ' ')} · /{p.slug}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-sm font-medium">{formatNaira(p.price)}</p>
                        <span className={`text-[10px] uppercase tracking-widest2 px-2 py-0.5 border ${p.stock === 0 ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-700'}`}>
                          {p.stock === 0 ? 'Sold out' : 'In stock'}
                        </span>
                      </div>
                      <div className="mt-auto pt-2 flex items-center gap-1 -ml-2">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="px-2 py-1.5 text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => onEdit(p)}
                          className="px-2 py-1.5 text-[11px] uppercase tracking-widest2 hover:text-neutral-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onToggleStock(p)}
                          className={`px-2 py-1.5 text-[11px] uppercase tracking-widest2 ${p.stock === 0 ? 'text-green-700 hover:text-green-900' : 'text-orange-600 hover:text-orange-800'}`}
                        >
                          {p.stock === 0 ? '→ Mark in stock' : '→ Mark sold out'}
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="px-2 py-1.5 text-[11px] uppercase tracking-widest2 text-red-600 hover:text-red-800 ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop table */}
            <div className="hidden md:block border border-neutral-200 bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-neutral-200 bg-neutral-50">
                    <th className="py-3 px-4 w-16"></th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const id = p._id || p.id;
                    return (
                      <tr key={id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-2 px-4">
                          <div className="w-12 h-16 bg-neutral-100 overflow-hidden">
                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />}
                          </div>
                        </td>
                        <td className="py-2 px-4 font-medium">
                          {p.name}
                          <div className="text-[11px] text-neutral-500">/{p.slug}</div>
                        </td>
                        <td className="py-2 px-4 text-neutral-600">{p.category?.replace('-', ' ')}</td>
                        <td className="py-2 px-4">{formatNaira(p.price)}</td>
                        <td className="py-2 px-4">
                          <span className={`text-[10px] uppercase tracking-widest2 px-2 py-0.5 border ${p.stock === 0 ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-700'}`}>
                            {p.stock === 0 ? 'Sold out' : 'In stock'}
                          </span>
                        </td>
                        <td className="py-2 px-4">{p.featured ? '★' : '—'}</td>
                        <td className="py-2 px-4 text-right whitespace-nowrap">
                          <Link to={`/product/${p.slug}`} target="_blank" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink mr-4">View</Link>
                          <button onClick={() => onEdit(p)} className="text-[11px] uppercase tracking-widest2 hover:text-neutral-500 mr-4">Edit</button>
                          <button
                            onClick={() => onToggleStock(p)}
                            className={`text-[11px] uppercase tracking-widest2 mr-4 ${p.stock === 0 ? 'text-green-700 hover:text-green-900' : 'text-orange-600 hover:text-orange-800'}`}
                          >
                            {p.stock === 0 ? '→ Mark in stock' : '→ Mark sold out'}
                          </button>
                          <button onClick={() => onDelete(p)} className="text-[11px] uppercase tracking-widest2 text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="container-x pb-16 sm:pb-20">
        <div className="border-t border-neutral-200 pt-10 mt-10">
          <p className="eyebrow">Storefront</p>
          <h2 className="section-title mt-1">Category cover images</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 mb-6">
            Hover a tile and click "Change image" to upload a photo or paste a URL.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORY_SLUGS.map((c) => (
              <CategoryImageCard
                key={c.slug}
                slug={c.slug}
                label={c.label}
                currentUrl={categoryImages[c.slug]}
                onSaved={onCategoryImageSaved}
              />
            ))}
          </div>
        </div>
      </div>

      <ProductEditor
        open={editorOpen}
        product={editing}
        onClose={() => { setEditorOpen(false); setEditing(null); }}
        onSaved={onSaved}
      />
    </div>
  );
}
