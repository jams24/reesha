import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatNaira, buildWhatsAppCartUrl } from '../lib/whatsapp.js';

export default function CartDrawer() {
  const { items, removeItem, clearCart, total, count, drawerOpen, setDrawerOpen } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
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
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  const onCheckout = () => {
    window.open(buildWhatsAppCartUrl(items), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-paper flex flex-col shadow-2xl animate-[slide-in-right_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 flex-shrink-0">
          <div>
            <p className="font-serif text-xl">Cart</p>
            <p className="eyebrow mt-0.5">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-500 hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-300 mb-4">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="font-serif text-xl mb-2">Your cart is empty</p>
              <p className="text-sm text-neutral-500 mb-8">Browse the shop and add something you love.</p>
              <button onClick={() => setDrawerOpen(false)} className="btn-outline">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.cartId} className="flex gap-3 p-4">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="w-16 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden"
                  >
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full" />
                    }
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="text-sm font-medium hover:underline line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-widest2">Size: {item.size}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-semibold">{formatNaira(item.price)}</p>
                      {item.cryptoPriceUsd && (
                        <p className="text-[10px] text-neutral-400">${item.cryptoPriceUsd} USDT</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartId)}
                    aria-label="Remove"
                    className="p-1 text-neutral-300 hover:text-red-500 flex-shrink-0 self-start mt-0.5 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6l12 12M18 6L6 18"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-5 space-y-3 flex-shrink-0 safe-bottom">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500 uppercase tracking-widest2 text-[11px]">Total</span>
              <span className="font-serif text-xl">{formatNaira(total)}</span>
            </div>
            <button onClick={onCheckout} className="btn-primary w-full gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.88 9.88 0 0 0 12.04 2z"/>
              </svg>
              Order all on WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full text-[11px] uppercase tracking-widest2 text-neutral-400 hover:text-neutral-600 py-1 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
