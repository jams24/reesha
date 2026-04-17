import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, sort]);

  const reset = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.size ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  return (
    <div className="container-x py-8 sm:py-14">
      <div className="mb-6 sm:mb-8">
        <p className="eyebrow">The shop</p>
        <h1 className="section-title mt-2">All wears</h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">Fresh picks every week. Nationwide delivery from Osogbo.</p>
      </div>

      <div className="lg:hidden mb-5">
        <CategoryPills
          active={filters.category}
          onSelect={(cat) => setFilters((f) => ({ ...f, category: cat }))}
        />
      </div>

      <div className="flex items-center justify-between mb-6 gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 border border-neutral-300 px-4 py-2.5 hover:border-ink min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
          Filters
          {activeFilterCount > 0 && <span className="bg-ink text-paper text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="text-[11px] sm:text-xs text-neutral-500 hidden xs:inline">{loading ? '…' : `${sorted.length}`}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-neutral-300 bg-white text-[11px] uppercase tracking-widest2 px-3 py-2.5 focus:outline-none focus:border-ink min-h-[44px]"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={reset} />
        </div>
        <div>
          <ProductGrid products={sorted} loading={loading} empty="No products match these filters. Try adjusting them." />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={clsx(
        'lg:hidden fixed inset-0 z-50 transition',
        drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        <div
          className={clsx('absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity', drawerOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={clsx(
            'absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-paper overflow-y-auto transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="sticky top-0 bg-paper flex items-center justify-between p-5 border-b border-neutral-200 z-10">
            <p className="font-serif text-xl">Filters</p>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="p-5">
            <FilterSidebar filters={filters} onChange={setFilters} onReset={reset} />
          </div>
          <div className="sticky bottom-0 bg-paper border-t border-neutral-200 p-4 flex gap-2 safe-bottom">
            <button onClick={reset} className="btn-outline flex-1">Reset</button>
            <button onClick={() => setDrawerOpen(false)} className="btn-primary flex-1">
              Show {loading ? '…' : sorted.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
