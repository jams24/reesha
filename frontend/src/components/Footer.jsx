import { Link } from 'react-router-dom';
import { buildGeneralWhatsAppUrl } from '../lib/whatsapp.js';

const IG_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE || 'reesha_wears31';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-paper mt-16 sm:mt-24">
      <div className="container-x py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 md:col-span-2">
          <h3 className="font-serif text-xl sm:text-2xl italic">Reesha Wears &amp; Thrift</h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-3 max-w-md leading-relaxed">
            Bridging affordable thrift and fashion. Carefully sourced baggy jeans, bum shorts, jorts, maxi skirts and imported wears — delivered nationwide from Osogbo.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <a
              href={`https://instagram.com/${IG_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 hover:text-neutral-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @{IG_HANDLE}
            </a>
            <a
              href="https://www.tiktok.com/@reesha.wears.thrift"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 hover:text-neutral-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
              @reesha.wears.thrift
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li><Link className="hover:text-neutral-500" to="/shop?category=baggy-jeans">Baggy jeans</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=bum-shorts">Bum shorts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=jorts">Jorts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=maxi-skirts">Maxi skirts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=imported">Imported wears</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li>
              <a href={buildGeneralWhatsAppUrl()} target="_blank" rel="noreferrer" className="hover:text-neutral-500">
                WhatsApp us
              </a>
            </li>
            <li><a href="tel:+2348161518807" className="hover:text-neutral-500">+234 816 151 8807</a></li>
            <li><a href="mailto:support@reeshawears.store" className="hover:text-neutral-500 break-all">support@reeshawears.store</a></li>
            <li className="text-neutral-500">Osogbo, Osun State<br/>Nationwide delivery</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container-x py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest2 text-neutral-500 safe-bottom">
          <p>© {new Date().getFullYear()} Reesha Wears &amp; Thrift</p>
          <p>Curated thrift · Imported wears</p>
        </div>
      </div>
    </footer>
  );
}
