import { Link } from 'react-router-dom';
import clsx from 'clsx';

export const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'baggy-jeans', label: 'Baggy jeans' },
  { slug: 'bum-shorts', label: 'Bum shorts' },
  { slug: 'jorts', label: 'Jorts' },
  { slug: 'maxi-skirts', label: 'Maxi skirts' },
  { slug: 'imported', label: 'Imported' },
];

export default function CategoryPills({ active, onSelect }) {
  if (onSelect) {
    return (
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => onSelect(c.slug)}
            className={clsx(
              'px-4 py-2 text-[11px] uppercase tracking-widest2 border whitespace-nowrap transition-colors',
              active === c.slug
                ? 'bg-ink text-paper border-ink'
                : 'border-neutral-300 text-neutral-600 hover:border-ink hover:text-ink'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to={c.slug === 'all' ? '/shop' : `/shop?category=${c.slug}`}
          className="px-4 py-2 text-[11px] uppercase tracking-widest2 border border-neutral-300 text-neutral-600 hover:border-ink hover:text-ink whitespace-nowrap transition-colors"
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
