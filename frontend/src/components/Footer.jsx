import { Link } from 'react-router-dom';
import { buildGeneralWhatsAppUrl } from '../lib/whatsapp.js';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-paper mt-24">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl italic">Reesha Wears &amp; Thrift</h3>
          <p className="text-sm text-neutral-600 mt-3 max-w-md leading-relaxed">
            Bridging affordable thrift and fashion. Carefully sourced baggy jeans, bum shorts, jorts, maxi skirts and imported wears — delivered nationwide from Osogbo.
          </p>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-neutral-500" to="/shop?category=baggy-jeans">Baggy jeans</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=bum-shorts">Bum shorts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=jorts">Jorts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=maxi-skirts">Maxi skirts</Link></li>
            <li><Link className="hover:text-neutral-500" to="/shop?category=imported">Imported wears</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={buildGeneralWhatsAppUrl()} target="_blank" rel="noreferrer" className="hover:text-neutral-500">
                WhatsApp us
              </a>
            </li>
            <li><a href="tel:+2348161518807" className="hover:text-neutral-500">+234 816 151 8807</a></li>
            <li><a href="mailto:Akinolamojisola31@gmail.com" className="hover:text-neutral-500 break-all">Akinolamojisola31@gmail.com</a></li>
            <li className="text-neutral-500">Osogbo, Osun State — Nationwide delivery</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest2 text-neutral-500">
          <p>© {new Date().getFullYear()} Reesha Wears &amp; Thrift</p>
          <p>Curated thrift · Imported wears</p>
        </div>
      </div>
    </footer>
  );
}
