import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { fetchProductBySlug } from '../lib/api.js';
import { buildWhatsAppOrderUrl, formatNaira } from '../lib/whatsapp.js';
import WishlistHeart from '../components/WishlistHeart.jsx';
import SizeGuideModal from '../components/SizeGuideModal.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    setSelectedSize('');
    fetchProductBySlug(slug)
      .then((data) => { if (!cancelled) setProduct(data); })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x py-16 grid md:grid-cols-2 gap-12">
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
      <div className="container-x py-24 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="section-title mt-2">We couldn't find that piece</h1>
        <p className="text-sm text-neutral-600 mt-3">It may have been sold or removed.</p>
        <Link to="/shop" className="btn-outline mt-8">Back to shop</Link>
      </div>
    );
  }

  const hasSizes = product.sizes?.length > 0;
  const outOfStock = product.stock === 0;

  const onOrder = () => {
    if (hasSizes && !selectedSize) {
      alert('Please select a size first.');
      return;
    }
    const url = buildWhatsAppOrderUrl(product, { size: selectedSize });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="container-x py-10 sm:py-14">
      <nav className="text-xs text-neutral-500 uppercase tracking-widest2 mb-8">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs uppercase tracking-widest2">No image</div>
            )}
            <WishlistHeart product={product} className="absolute top-4 right-4" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={clsx(
                    'aspect-square bg-neutral-100 overflow-hidden border-2 transition',
                    i === activeImage ? 'border-ink' : 'border-transparent hover:border-neutral-400'
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
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif leading-tight">{product.name}</h1>
          <p className="mt-4 text-2xl">{formatNaira(product.price)}</p>

          {product.description && (
            <p className="mt-6 text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {hasSizes && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Size</p>
                <button
                  onClick={() => setGuideOpen(true)}
                  className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink underline underline-offset-4"
                >
                  Size guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={clsx(
                      'min-w-[52px] px-4 py-2 text-xs uppercase tracking-widest2 border transition-colors',
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

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOrder}
              disabled={outOfStock}
              className={clsx(
                'flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-widest2 font-medium transition-colors',
                outOfStock
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-ink text-paper hover:bg-neutral-700'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.88 9.88 0 0 0 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.23 8.23 0 0 1-1.26-4.37c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.28.86 5.84 2.42a8.24 8.24 0 0 1 2.42 5.84c0 4.55-3.7 8.24-8.27 8.24z"/>
              </svg>
              {outOfStock ? 'Sold' : 'Order on WhatsApp'}
            </button>

            <button onClick={onCopyLink} className="btn-outline">
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          <ul className="mt-10 space-y-2 text-sm text-neutral-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Nationwide delivery from Osogbo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Payment via bank transfer on WhatsApp
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-ink rounded-full" /> Most items are one-of-one — first come, first served
            </li>
          </ul>
        </div>
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
