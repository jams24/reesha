import { CATEGORIES } from './CategoryPills.jsx';
import clsx from 'clsx';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', '26', '28', '30', '32', '34', '36'];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const { category = 'all', size = '', minPrice = '', maxPrice = '', search = '' } = filters;

  return (
    <aside className="space-y-8">
      <div>
        <label className="eyebrow block mb-2">Search</label>
        <input
          className="input"
          placeholder="e.g. denim skirt"
          value={search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => onChange({ ...filters, category: c.slug })}
              className={clsx(
                'text-left text-sm py-1 transition-colors',
                category === c.slug ? 'text-ink font-medium' : 'text-neutral-500 hover:text-ink'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ ...filters, size: '' })}
            className={clsx(
              'text-[11px] uppercase tracking-widest2 border px-3 py-1.5 transition-colors',
              !size ? 'bg-ink text-paper border-ink' : 'border-neutral-300 hover:border-ink'
            )}
          >
            Any
          </button>
          {COMMON_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, size: s })}
              className={clsx(
                'text-[11px] uppercase tracking-widest2 border px-3 py-1.5 transition-colors',
                size === s ? 'bg-ink text-paper border-ink' : 'border-neutral-300 hover:border-ink'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Price (₦)</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            placeholder="Min"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          />
          <input
            className="input"
            placeholder="Max"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <button onClick={onReset} className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink underline underline-offset-4">
        Reset filters
      </button>
    </aside>
  );
}
