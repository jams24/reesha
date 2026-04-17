import ProductCard from './ProductCard.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';

export default function ProductGrid({ products, loading, empty }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} />)}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="py-24 text-center text-neutral-500">
        <p className="eyebrow mb-3">Nothing here yet</p>
        <p className="text-sm">{empty || 'No products match your filters.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {products.map((p) => <ProductCard key={p._id || p.slug} product={p} />)}
    </div>
  );
}
