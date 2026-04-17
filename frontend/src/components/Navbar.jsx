import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { getWishlist, onWishlistChange } from '../lib/wishlist.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(() => getWishlist().length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => onWishlistChange(() => setCount(getWishlist().length)), []);

  return (
    <header className={clsx(
      'sticky top-0 z-40 bg-paper/85 backdrop-blur border-b transition-colors',
      scrolled ? 'border-neutral-200' : 'border-transparent'
    )}>
      <div className="container-x flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif italic text-2xl tracking-tight">Reesha</span>
          <span className="hidden sm:block text-[10px] uppercase tracking-widest2 text-neutral-500">
            Wears &middot; Thrift
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
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

        <div className="flex items-center gap-3">
          <Link
            to="/wishlist"
            className="relative inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 font-medium hover:text-neutral-500"
            aria-label="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 20.4s-7.5-4.6-7.5-10.2a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.6-8.5 10.2-8.5 10.2z" />
            </svg>
            <span className="hidden sm:inline">Saved</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-ink text-paper text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{count}</span>
            )}
          </Link>
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-paper">
          <div className="container-x flex flex-col py-4 gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => clsx(
                  'text-sm uppercase tracking-widest2 font-medium',
                  isActive ? 'text-ink' : 'text-neutral-500'
                )}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
