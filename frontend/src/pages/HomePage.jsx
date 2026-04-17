import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Hero from '../components/Hero.jsx';
import CategoryPills, { CATEGORIES } from '../components/CategoryPills.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import InstagramFeed from '../components/InstagramFeed.jsx';
import { fetchProducts } from '../lib/api.js';

const CATEGORY_TILES = CATEGORIES.filter((c) => c.slug !== 'all').slice(0, 5);

const TILE_IMAGES = {
  'baggy-jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  'bum-shorts': 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80',
  'jorts': 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=800&q=80',
  'maxi-skirts': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
  'imported': 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts({ featured: 'true', limit: 8 });
        let items = data.items || [];
        if (items.length < 4) {
          const more = await fetchProducts({ limit: 8 });
          const existing = new Set(items.map((i) => i._id || i.id));
          items = [...items, ...(more.items || []).filter((i) => !existing.has(i._id || i.id))].slice(0, 8);
        }
        if (!cancelled) setFeatured(items);
      } catch (e) {
        console.warn('Could not load products:', e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <Hero />

      <section className="container-x py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="section-title mt-2">The edit</h2>
          </div>
          <div className="hidden sm:block">
            <CategoryPills />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORY_TILES.map((c, i) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className={clsx(
                'group relative aspect-[3/4] bg-neutral-100 overflow-hidden',
                i === 4 && 'col-span-2 md:col-span-1 aspect-[6/4] md:aspect-[3/4]'
              )}
            >
              <img
                src={TILE_IMAGES[c.slug]}
                alt={c.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-paper">
                <p className="font-serif text-base sm:text-xl">{c.label}</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest2 opacity-80 mt-0.5">Shop now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x py-12 sm:py-16 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="eyebrow">New &amp; featured</p>
            <h2 className="section-title mt-2">This week's picks</h2>
          </div>
          <Link to="/shop" className="btn-outline self-start sm:self-auto">View all</Link>
        </div>
        <ProductGrid products={featured} loading={loading} empty="Products will appear here once you add them in the admin dashboard." />
      </section>

      <section className="bg-ink text-paper">
        <div className="container-x py-16 sm:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-400">About Reesha</p>
            <h2 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Affordable thrift,<br />
              <span className="italic">fashion-forward.</span>
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p>
              Reesha Wears &amp; Thrift is your one-stop shop for all varieties of thrift wears — baggy jeans, bum shorts, jorts, maxi skirts and more. We also curate imported pieces for when you want something fresh.
            </p>
            <p>
              At Reesha, we bridge the gap between affordable thrift and fashion, ensuring you always have access to the trends you love.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest2 border-b border-paper pb-1 hover:text-neutral-400 hover:border-neutral-400 transition">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <InstagramFeed />
    </div>
  );
}
