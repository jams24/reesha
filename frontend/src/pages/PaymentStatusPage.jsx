import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPaymentStatus } from '../lib/api.js';

const NETWORK_LABELS = {
  USDT_ERC20: 'USDT (ERC-20 · Ethereum)',
  USDT_BEP20: 'USDT (BEP-20 · BNB Chain)',
  USDC_BEP20: 'USDC (BEP-20 · BNB Chain)',
  USDC_SOL:   'USDC (Solana)',
};

const POLL_INTERVAL = 5000;

export default function PaymentStatusPage() {
  const { paymentId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const load = async () => {
    try {
      const data = await fetchPaymentStatus(paymentId);
      setOrder(data);
      setError('');
      return data.status;
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load order status.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().then((status) => {
      if (status === 'PENDING') {
        timerRef.current = setInterval(async () => {
          const s = await load();
          if (s !== 'PENDING') clearInterval(timerRef.current);
        }, POLL_INTERVAL);
      }
    });
    return () => clearInterval(timerRef.current);
  }, [paymentId]);

  if (loading) {
    return (
      <div className="container-x py-20 text-center">
        <div className="animate-pulse text-neutral-400 text-sm">Loading order…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-x py-20 text-center">
        <p className="eyebrow mb-2">Error</p>
        <p className="text-sm text-neutral-600">{error}</p>
        <Link to="/shop" className="btn-outline mt-8 inline-flex">Back to shop</Link>
      </div>
    );
  }

  const { status, invoiceUrl, productName, productSlug, cryptoPriceUsd, currency, size, whatsappUrl } = order;
  const networkLabel = NETWORK_LABELS[currency] || currency;

  return (
    <div className="container-x py-10 sm:py-16 max-w-xl mx-auto">
      <nav className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest2 mb-8 truncate">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/product/${productSlug}`} className="hover:text-ink">{productName}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Payment</span>
      </nav>

      <div className="border border-neutral-200 p-6 sm:p-8 space-y-6">
        <div>
          <p className="eyebrow">Order summary</p>
          <h1 className="font-serif text-2xl sm:text-3xl mt-1">{productName}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {size ? `Size: ${size} · ` : ''}{networkLabel}
          </p>
          <p className="text-xl font-medium mt-2">${cryptoPriceUsd} USD</p>
        </div>

        <hr className="border-neutral-200" />

        {status === 'PENDING' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
              <p className="text-sm font-medium">Awaiting payment</p>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Open the secure payment page below to send your USDT. This page will update automatically once your transaction is confirmed on-chain.
            </p>
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open payment page
            </a>
            <p className="text-[11px] text-neutral-400 text-center">
              Checking for confirmation every 5 seconds…
            </p>
          </div>
        )}

        {status === 'CONFIRMED' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700">Payment confirmed!</p>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Your USDT payment has been confirmed. Tap the button below to message Reesha on WhatsApp with your order details — they'll arrange delivery for you.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.88 9.88 0 0 0 12.04 2z"/>
              </svg>
              Contact Reesha on WhatsApp
            </a>
            <p className="text-[11px] text-neutral-500 text-center">
              A pre-filled message with your order details will open automatically.
            </p>
          </div>
        )}

        {status === 'EXPIRED' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 flex-shrink-0" />
              <p className="text-sm font-medium text-neutral-600">Payment expired</p>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              The payment window closed before we received your USDT. Please return to the product page and start a new payment.
            </p>
            <Link to={`/product/${productSlug}`} className="btn-outline w-full inline-flex items-center justify-center">
              Try again
            </Link>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-sm font-medium text-red-700">Payment failed</p>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Something went wrong with this payment. Please try again from the product page.
            </p>
            <Link to={`/product/${productSlug}`} className="btn-outline w-full inline-flex items-center justify-center">
              Try again
            </Link>
          </div>
        )}

        <hr className="border-neutral-200" />

        <p className="text-[10px] text-neutral-400 break-all">
          Order ref: {paymentId}
        </p>
      </div>
    </div>
  );
}
