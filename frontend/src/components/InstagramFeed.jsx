const HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE || 'reeshawears';

export default function InstagramFeed() {
  const url = `https://instagram.com/${HANDLE}`;
  return (
    <section className="border-t border-neutral-200">
      <div className="container-x py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Latest on the gram</p>
            <h2 className="section-title mt-2">@{HANDLE}</h2>
          </div>
          <a href={url} target="_blank" rel="noreferrer" className="btn-outline">Follow on Instagram</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="aspect-square bg-neutral-100 group relative overflow-hidden"
            >
              <img
                src={`https://picsum.photos/seed/reesha-ig-${i}/400/400`}
                alt={`Instagram placeholder ${i + 1}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fafaf9" strokeWidth="1.5" className="opacity-0 group-hover:opacity-100 transition">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#fafaf9" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Placeholder grid — connect your Instagram handle via <code className="bg-neutral-100 px-1">VITE_INSTAGRAM_HANDLE</code> and an embed widget (Elfsight / SnapWidget) to show real posts.
        </p>
      </div>
    </section>
  );
}
