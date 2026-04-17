import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { isInWishlist, toggleWishlist, onWishlistChange } from '../lib/wishlist.js';

export default function WishlistHeart({ product, className }) {
  const [active, setActive] = useState(() => isInWishlist(product.slug));

  useEffect(() => onWishlistChange(() => setActive(isInWishlist(product.slug))), [product.slug]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowActive = toggleWishlist(product);
    setActive(nowActive);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={clsx(
        'w-9 h-9 flex items-center justify-center bg-paper/90 backdrop-blur border border-neutral-200 hover:border-ink transition-colors',
        className
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20.4s-7.5-4.6-7.5-10.2a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.6-8.5 10.2-8.5 10.2z" />
      </svg>
    </button>
  );
}
