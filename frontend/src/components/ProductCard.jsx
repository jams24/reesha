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
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs uppercase tracking-widest2">
            No image
          </div>
        )}
        <WishlistHeart product={product} className="absolute top-3 right-3" />
        {product.stock === 0 && (
          <div className="absolute bottom-3 left-3 bg-ink text-paper text-[10px] uppercase tracking-widest2 px-2 py-1">
            Sold
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{product.name}</h3>
          <p className="text-[11px] uppercase tracking-widest2 text-neutral-500 mt-0.5">
            {product.category?.replace('-', ' ')}
          </p>
        </div>
        <p className="text-sm whitespace-nowrap">{formatNaira(product.price)}</p>
      </div>
    </Link>
  );
}
