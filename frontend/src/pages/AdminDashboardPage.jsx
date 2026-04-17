import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchProducts, deleteProduct } from '../lib/api.js';
import { formatNaira } from '../lib/whatsapp.js';
import ProductEditor from '../components/admin/ProductEditor.jsx';

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({ limit: 100 });
      setProducts(data.items || []);
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
    await deleteProduct(p._id);
    setProducts((arr) => arr.filter((x) => x._id !== p._id));
  };

  const onSaved = (saved, wasEditing) => {
    setProducts((arr) => {
      if (wasEditing) return arr.map((x) => (x._id === saved._id ? saved : x));
      return [saved, ...arr];
    });
    setEditorOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 bg-paper">
        <div className="container-x h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-serif italic text-2xl">Reesha</Link>
            <span className="hidden sm:inline text-[11px] uppercase tracking-widest2 text-neutral-500">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-neutral-500">{admin?.email}</span>
            <Link to="/" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink">View store</Link>
            <button onClick={logout} className="text-[11px] uppercase tracking-widest2 hover:text-neutral-500">Sign out</button>
          </div>
        </div>
      </header>

      <div className="container-x py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">Inventory</p>
            <h1 className="section-title mt-1">Products</h1>
            <p className="text-sm text-neutral-600 mt-1">{loading ? 'Loading…' : `${filtered.length} of ${products.length} shown`}</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <input
              className="input flex-1 sm:w-64"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={onNew} className="btn-primary whitespace-nowrap">+ New product</button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300">
            <p className="eyebrow mb-3">No products yet</p>
            <p className="text-sm text-neutral-600">Click "New product" to add your first item.</p>
          </div>
        ) : (
          <div className="border border-neutral-200 bg-white overflow-x-auto">
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
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-4">
                      <div className="w-12 h-16 bg-neutral-100 overflow-hidden">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="py-2 px-4 font-medium">
                      {p.name}
                      <div className="text-[11px] text-neutral-500">/{p.slug}</div>
                    </td>
                    <td className="py-2 px-4 text-neutral-600">{p.category?.replace('-', ' ')}</td>
                    <td className="py-2 px-4">{formatNaira(p.price)}</td>
                    <td className="py-2 px-4">{p.stock}</td>
                    <td className="py-2 px-4">{p.featured ? '★' : '—'}</td>
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <Link to={`/product/${p.slug}`} target="_blank" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink mr-4">View</Link>
                      <button onClick={() => onEdit(p)} className="text-[11px] uppercase tracking-widest2 hover:text-neutral-500 mr-4">Edit</button>
                      <button onClick={() => onDelete(p)} className="text-[11px] uppercase tracking-widest2 text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
