import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import { fetchProducts } from '../lib/api.js';

const DEFAULT_FILTERS = { category: 'all', size: '', minPrice: '', maxPrice: '', search: '' };

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
  }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    setSearchParams(params, { replace: true });
  }, [filters.category, filters.search, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({
          category: filters.category !== 'all' ? filters.category : undefined,
          size: filters.size || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          search: filters.search || undefined,
          limit: 60,
        });
        if (!cancelled) setProducts(data.items || []);
      } catch (e) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [filters]);

  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, sort]);

  const reset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="mb-8">
        <p className="eyebrow">The shop</p>
        <h1 className="section-title mt-2">All wears</h1>
        <p className="text-sm text-neutral-600 mt-2">Fresh picks every week. Nationwide delivery from Osogbo.</p>
      </div>

      <div className="lg:hidden mb-6">
        <CategoryPills
          active={filters.category}
          onSelect={(cat) => setFilters((f) => ({ ...f, category: cat }))}
        />
      </div>

      <div className="flex items-center justify-between mb-6 gap-3">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="lg:hidden text-[11px] uppercase tracking-widest2 border border-neutral-300 px-4 py-2 hover:border-ink"
        >
          {showFilters ? 'Hide filters' : 'Filters'}
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-neutral-500">{loading ? 'Loading…' : `${sorted.length} items`}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-neutral-300 bg-white text-xs uppercase tracking-widest2 px-3 py-2 focus:outline-none focus:border-ink"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <FilterSidebar filters={filters} onChange={setFilters} onReset={reset} />
        </div>
        <div>
          <ProductGrid products={sorted} loading={loading} empty="No products match these filters. Try adjusting them." />
        </div>
      </div>
    </div>
  );
}
