import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { getWishlist, onWishlistChange } from '../lib/wishlist.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/wishlist', label: 'Wishlist' },
];

const CATEGORY_LINKS = [
  { slug: 'baggy-jeans', label: 'Baggy jeans' },
  { slug: 'bum-shorts', label: 'Bum shorts' },
  { slug: 'jorts', label: 'Jorts' },
  { slug: 'maxi-skirts', label: 'Maxi skirts' },
  { slug: 'imported', label: 'Imported' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(() => getWishlist().length);
  const { pathname } = useLocation();

  useEffect(() => onWishlistChange(() => setCount(getWishlist().length)), []);
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header className="relative z-40 bg-paper border-b border-neutral-200">
      <div className="container-x flex items-center justify-between h-14 sm:h-20">
        <Link to="/" className="flex items-baseline gap-2" aria-label="Reesha home">
          <span className="font-serif italic text-xl sm:text-2xl tracking-tight">Reesha</span>
          <span className="hidden sm:block text-[10px] uppercase tracking-widest2 text-neutral-500">
            Wears &middot; Thrift
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.slice(0, 3).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => clsx(
                'text-[11px] uppercase tracking-widest2 font-medium transition-colors',
                isActive ? 'text-ink' : 'text-neutral-500 hover:text-ink'
              )}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/wishlist"
            className="relative inline-flex items-center gap-2 p-2 text-[11px] uppercase tracking-widest2 font-medium hover:text-neutral-500 min-w-[44px] min-h-[44px] justify-center"
            aria-label="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20.4s-7.5-4.6-7.5-10.2a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.6-8.5 10.2-8.5 10.2z" />
            </svg>
            <span className="hidden md:inline">Saved</span>
            {count > 0 && (
              <span className="absolute top-0 right-0 bg-ink text-paper text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{count}</span>
            )}
          </Link>
          <button
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-paper flex flex-col animate-[fade-in_0.2s_ease-out]">
          <div className="flex items-center justify-between h-14 container-x border-b border-neutral-200">
            <Link to="/" onClick={() => setOpen(false)} className="font-serif italic text-xl">Reesha</Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto container-x py-6">
            <div className="flex flex-col">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'py-4 border-b border-neutral-200 font-serif text-2xl tracking-tight',
                    isActive ? 'text-ink italic' : 'text-neutral-500'
                  )}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-8">
              <p className="eyebrow mb-3">Categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LINKS.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/shop?category=${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 text-[11px] uppercase tracking-widest2 border border-neutral-300 text-neutral-600"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
