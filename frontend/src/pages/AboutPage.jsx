import { buildGeneralWhatsAppUrl } from '../lib/whatsapp.js';

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-neutral-200">
        <div className="container-x py-12 sm:py-20 lg:py-28 max-w-3xl">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 sm:mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl font-serif tracking-tight">
            Thrift, <span className="italic">reimagined</span> for the everyday.
          </h1>
          <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5 text-sm sm:text-base text-neutral-700 leading-relaxed">
            <p>
              Reesha Wears &amp; Thrift is your one-stop shop for all varieties of thrift wears — including baggy jeans, bum shorts, jorts, maxi skirts and more. We also sell imported wears for when you want something crisp off the shelf.
            </p>
            <p>
              At Reesha, we bridge the gap between affordable thrift and fashion, ensuring you always have access to the trends you love — without the mark-up.
            </p>
            <p>
              Based in Osogbo, Osun State, we deliver nationwide across Nigeria. Every piece is hand-picked, inspected and steamed before it ships.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-20 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          { title: 'Hand-curated', body: 'Every piece is picked with care — no filler, no leftovers.' },
          { title: 'Nationwide delivery', body: 'We ship to every state in Nigeria via reliable logistics partners.' },
          { title: 'Fair prices', body: 'Affordable thrift meets fashion-forward imports. Always.' },
        ].map((v) => (
          <div key={v.title} className="border-t border-ink pt-5 sm:pt-6">
            <p className="eyebrow">Reesha promise</p>
            <h3 className="mt-2 sm:mt-3 font-serif text-xl sm:text-2xl">{v.title}</h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">{v.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-ink text-paper">
        <div className="container-x py-12 sm:py-20 grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-400">Get in touch</p>
            <h2 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
              We're a message away.
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-300 max-w-md">
              Questions about an item, measurements, or delivery? WhatsApp is fastest.
            </p>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 bg-paper text-ink px-6 sm:px-8 py-3 text-xs uppercase tracking-widest2 font-medium hover:bg-neutral-200 transition min-h-[48px]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.88 9.88 0 0 0 12.04 2z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <dl className="space-y-5 sm:space-y-6">
            <div className="border-t border-neutral-700 pt-4 sm:pt-6">
              <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-400">Phone / WhatsApp</dt>
              <dd className="mt-2 text-base sm:text-lg"><a href="tel:+2348161518807" className="hover:text-neutral-300">+234 816 151 8807</a></dd>
            </div>
            <div className="border-t border-neutral-700 pt-4 sm:pt-6">
              <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-400">Email</dt>
              <dd className="mt-2 text-base sm:text-lg break-all">
                <a href="mailto:support@reeshawears.store" className="hover:text-neutral-300">support@reeshawears.store</a>
              </dd>
            </div>
            <div className="border-t border-neutral-700 pt-4 sm:pt-6">
              <dt className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-400">Location</dt>
              <dd className="mt-2 text-base sm:text-lg">Osogbo, Osun State</dd>
              <dd className="text-xs sm:text-sm text-neutral-400 mt-1">We deliver nationwide across Nigeria.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-x py-12 sm:py-20">
        <p className="eyebrow text-center">Find us</p>
        <h2 className="section-title mt-2 text-center">Osogbo, Osun State</h2>
        <div className="mt-6 sm:mt-8 aspect-[4/3] sm:aspect-[16/7] bg-neutral-100 overflow-hidden">
          <iframe
            title="Osogbo map"
            src="https://www.google.com/maps?q=Osogbo,%20Osun%20State,%20Nigeria&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
