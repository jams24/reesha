import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, onWishlistChange, removeFromWishlist } from '../lib/wishlist.js';
import { formatNaira } from '../lib/whatsapp.js';

export default function WishlistPage() {
  const [items, setItems] = useState(() => getWishlist());

  useEffect(() => onWishlistChange(() => setItems(getWishlist())), []);

  return (
    <div className="container-x py-8 sm:py-14">
      <p className="eyebrow">Your picks</p>
      <h1 className="section-title mt-2">Wishlist</h1>
      <p className="text-xs sm:text-sm text-neutral-600 mt-2">
        Saved on this device. Message us on WhatsApp to reserve a piece.
      </p>

      {items.length === 0 ? (
        <div className="py-20 sm:py-24 text-center">
          <p className="text-neutral-500 mb-6 text-sm">You haven't saved anything yet.</p>
          <Link to="/shop" className="btn-outline">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-8 sm:gap-y-10">
          {items.map((item) => (
            <div key={item.slug} className="group">
              <Link to={`/product/${item.slug}`} className="block">
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest2 text-neutral-400">No image</div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-xs sm:text-sm font-medium truncate">{item.name}</h3>
                  <p className="text-xs sm:text-sm mt-1 font-medium">{formatNaira(item.price)}</p>
                </div>
              </Link>
              <button
                onClick={() => removeFromWishlist(item.slug)}
                className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink underline underline-offset-4 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
