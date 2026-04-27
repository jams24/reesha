import { Link } from 'react-router-dom';
import WishlistHeart from './WishlistHeart.jsx';
import { formatNaira } from '../lib/whatsapp.js';

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  const soldOut = product.stock === 0;
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${soldOut ? 'opacity-50' : 'group-hover:scale-[1.03]'}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] uppercase tracking-widest2">
            No image
          </div>
        )}
        <WishlistHeart product={product} className="absolute top-2 right-2 sm:top-3 sm:right-3" />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-paper text-ink text-[9px] sm:text-[10px] uppercase tracking-widest2 px-3 py-1.5 border border-neutral-300">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs sm:text-sm font-medium truncate ${soldOut ? 'text-neutral-400' : ''}`}>{product.name}</h3>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-500 mt-0.5">
            {product.category?.replace('-', ' ')}
          </p>
        </div>
        <p className={`text-xs sm:text-sm whitespace-nowrap font-medium ${soldOut ? 'text-neutral-400' : ''}`}>{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
