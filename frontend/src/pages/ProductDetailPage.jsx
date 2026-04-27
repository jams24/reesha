import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { fetchProductBySlug, fetchProducts } from '../lib/api.js';
import { buildWhatsAppOrderUrl, formatNaira } from '../lib/whatsapp.js';
import { useCart } from '../context/CartContext.jsx';
import WishlistHeart from '../components/WishlistHeart.jsx';
import SizeGuideModal from '../components/SizeGuideModal.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import PaymentModal from '../components/PaymentModal.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [related, setRelated] = useState([]);
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setSelectedSize('');
    fetchProductBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          fetchProducts({ category: data.category, limit: 5 })
            .then((r) => {
              if (!cancelled) setRelated((r.items || []).filter((p) => p.slug !== slug).slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x py-8 sm:py-16 grid md:grid-cols-2 gap-8 md:gap-12">
        <LoadingSkeleton />
        <div className="space-y-4">
          <div className="h-6 bg-neutral-200 w-2/3 animate-pulse" />
          <div className="h-4 bg-neutral-200 w-1/3 animate-pulse" />
          <div className="h-24 bg-neutral-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-x py-20 sm:py-24 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="section-title mt-2">We couldn't find that piece</h1>
        <p className="text-sm text-neutral-600 mt-3">It may have been sold or removed.</p>
        <Link to="/shop" className="btn-outline mt-8 inline-flex">Back to shop</Link>
      </div>
    );
  }

  const hasSizes = product.sizes?.length > 0;
  const outOfStock = product.stock === 0;
  const hasCrypto = product.cryptoPriceUsd > 0;
  const inCart = isInCart(product.id, selectedSize);

  const onAddToCart = () => {
    if (hasSizes && !selectedSize) { alert('Please select a size first.'); return; }
    addItem(product, selectedSize);
  };

  const onOrder = () => {
    if (hasSizes && !selectedSize) { alert('Please select a size first.'); return; }
    window.open(buildWhatsAppOrderUrl(product, { size: selectedSize }), '_blank', 'noopener,noreferrer');
  };

  const onCryptoOrder = () => {
    if (hasSizes && !selectedSize) { alert('Please select a size first.'); return; }
    setCryptoModalOpen(true);
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="container-x py-6 sm:py-14 pb-28 md:pb-14">
      <nav className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest2 mb-5 sm:mb-8 truncate">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] uppercase tracking-widest2">No image</div>
            )}
            <WishlistHeart product={product} className="absolute top-3 right-3 sm:top-4 sm:right-4" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={clsx(
                    'aspect-square bg-neutral-100 overflow-hidden border-2 transition',
                    i === activeImage ? 'border-ink' : 'border-transparent'
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-4">
          <p className="eyebrow">{product.category?.replace('-', ' ')}</p>
          <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight">{product.name}</h1>
          <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-medium">{formatNaira(product.price)}</p>

          {product.description && (
            <p className="mt-4 sm:mt-6 text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {hasSizes && (
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Size</p>
                <button
                  onClick={() => setGuideOpen(true)}
                  className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink underline underline-offset-4 py-1"
                >
                  Size guide
                </button>
              </div>
              <div className="mt-3 grid grid-cols-4 sm:flex sm:flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={clsx(
                      'min-h-[44px] px-3 sm:px-4 text-xs uppercase tracking-widest2 border transition-colors',
                      selectedSize === s
                        ? 'bg-ink text-paper border-ink'
                        : 'border-neutral-300 hover:border-ink'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop order buttons */}
          <div className="mt-8 sm:mt-10 hidden md:flex flex-col gap-2">
            <div className="flex gap-3">
              <button
                onClick={onAddToCart}
                disabled={outOfStock || inCart}
                className={clsx(
                  'flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-widest2 font-medium transition-colors min-h-[52px]',
                  outOfStock
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : inCart
                    ? 'bg-neutral-700 text-paper cursor-default'
                    : 'bg-ink text-paper hover:bg-neutral-700'
                )}
              >
                {outOfStock ? 'Sold out' : inCart ? 'Added to cart ✓' : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Add to cart
                  </>
                )}
              </button>
              <button onClick={onCopyLink} className="btn-outline">
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
            {!outOfStock && (
              <button onClick={onOrder} className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest2 font-medium border border-neutral-300 hover:border-ink transition-colors min-h-[48px]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.88 9.88 0 0 0 12.04 2z"/>
                </svg>
                Order on WhatsApp (₦)
              </button>
            )}
            {hasCrypto && !outOfStock && (
              <button onClick={onCryptoOrder} className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest2 font-medium border border-neutral-300 hover:border-ink transition-colors min-h-[48px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 4-5 4-5 7h5M12 18.5v.5"/>
                </svg>
                Pay with USDT (${product.cryptoPriceUsd})
              </button>
            )}
          </div>

          <ul className="mt-8 sm:mt-10 space-y-2 text-xs sm:text-sm text-neutral-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Nationwide delivery from Osogbo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Pay in Naira via WhatsApp or USDT crypto
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Most items are one-of-one — first come, first served
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-paper/95 backdrop-blur border-t border-neutral-200 p-3 sticky-cta">
        <div className="flex gap-2">
          <button
            onClick={onCopyLink}
            aria-label="Copy link"
            className="w-12 h-12 border border-neutral-300 flex items-center justify-center hover:border-ink flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {copied ? <path d="M5 12l4 4L19 7"/> : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>}
            </svg>
          </button>
          <button
            onClick={onAddToCart}
            disabled={outOfStock || inCart}
            className={clsx(
              'flex-1 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest2 font-medium transition-colors',
              outOfStock ? 'bg-neutral-200 text-neutral-500' : inCart ? 'bg-neutral-700 text-paper' : 'bg-ink text-paper'
            )}
          >
            {outOfStock ? 'Sold out' : inCart ? 'In cart ✓' : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Add to cart
              </>
            )}
          </button>
          {hasCrypto && !outOfStock && (
            <button onClick={onCryptoOrder} className="w-12 h-12 border border-neutral-300 flex items-center justify-center hover:border-ink flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 4-5 4-5 7h5M12 18.5v.5"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-20 border-t border-neutral-200 pt-10 pb-28 md:pb-10">
          <p className="eyebrow mb-4">You may also like</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <PaymentModal
        open={cryptoModalOpen}
        product={product}
        selectedSize={selectedSize}
        onClose={() => setCryptoModalOpen(false)}
      />
    </div>
  );
}
