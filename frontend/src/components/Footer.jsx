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
          <a
            href={`https://instagram.com/${IG_HANDLE}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-[11px] uppercase tracking-widest2 hover:text-neutral-500"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            @{IG_HANDLE}
          </a>
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
            <li><a href="mailto:Akinolamojisola31@gmail.com" className="hover:text-neutral-500 break-all">Akinolamojisola31@gmail.com</a></li>
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
