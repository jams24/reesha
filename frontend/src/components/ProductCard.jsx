import { Link } from 'react-router-dom';
import WishlistHeart from './WishlistHeart.jsx';
import { formatNaira } from '../lib/whatsapp.js';

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] uppercase tracking-widest2">
            No image
          </div>
        )}
        <WishlistHeart product={product} className="absolute top-2 right-2 sm:top-3 sm:right-3" />
        {product.stock === 0 && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-ink text-paper text-[9px] sm:text-[10px] uppercase tracking-widest2 px-2 py-1">
            Sold
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-medium truncate">{product.name}</h3>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-500 mt-0.5">
            {product.category?.replace('-', ' ')}
          </p>
        </div>
        <p className="text-xs sm:text-sm whitespace-nowrap font-medium">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
