import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="border-b border-neutral-200">
      <div className="container-x py-20 sm:py-28 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in">
          <p className="eyebrow">Est. Osogbo · Nationwide delivery</p>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight">
            Curated thrift.<br />
            <span className="italic">Imported edit.</span>
          </h1>
          <p className="mt-8 text-neutral-600 max-w-xl leading-relaxed">
            Baggy jeans, bum shorts, jorts, maxi skirts and imported wears — thoughtfully sourced, fairly priced. We bridge affordable thrift and fashion so you always have access to the trends you love.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">Shop the collection</Link>
            <Link to="/about" className="btn-outline">Our story</Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] bg-neutral-200 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="Featured thrift look"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="hidden sm:block absolute -bottom-6 -left-6 bg-ink text-paper px-6 py-4 max-w-[200px]">
            <p className="text-[10px] uppercase tracking-widest2 text-neutral-400">New arrivals</p>
            <p className="font-serif italic text-lg mt-1">Fresh picks every week</p>
          </div>
        </div>
      </div>
    </section>
  );
}
