import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { createCryptoPayment } from '../lib/api.js';

const NETWORKS = [
  { value: 'USDT_ERC20', label: 'USDT — Ethereum (ERC-20)', time: '~3 min' },
  { value: 'USDT_BEP20', label: 'USDT — BNB Smart Chain (BEP-20)', time: '~45 sec' },
];

export default function PaymentModal({ open, product, selectedSize, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', currency: 'USDT_BEP20' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm({ name: '', phone: '', currency: 'USDT_BEP20' });
    setError('');
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !product) return null;

  const price = product.cryptoPriceUsd;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const result = await createCryptoPayment({
        productId: product.id,
        size: selectedSize || undefined,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim() || undefined,
        currency: form.currency,
      });
      navigate(`/pay/${result.paymentId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="bg-paper w-full sm:max-w-md sm:rounded-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-200">
          <div>
            <p className="eyebrow">Crypto checkout</p>
            <p className="font-serif text-lg mt-0.5">Pay with USDT</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-neutral-500 hover:text-ink min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-4">
          <div className="bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm">
            <p className="font-medium">{product.name}</p>
            <p className="text-neutral-500 text-xs mt-0.5">
              {selectedSize ? `Size: ${selectedSize} · ` : ''}
              <span className="text-ink font-semibold">${price} USD</span>
            </p>
          </div>

          <div>
            <label className="eyebrow block mb-1.5">Your name *</label>
            <input
              className="input"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="eyebrow block mb-1.5">WhatsApp number <span className="normal-case text-neutral-400 text-[10px]">(optional)</span></label>
            <input
              className="input"
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="eyebrow block mb-1.5">Payment network</label>
            <div className="space-y-2">
              {NETWORKS.map((n) => (
                <label
                  key={n.value}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 border cursor-pointer transition-colors',
                    form.currency === n.value ? 'border-ink bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'
                  )}
                >
                  <input
                    type="radio"
                    name="currency"
                    value={n.value}
                    checked={form.currency === n.value}
                    onChange={() => setForm({ ...form, currency: n.value })}
                    className="accent-black"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-[11px] text-neutral-500">Confirms {n.time} after payment</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">{error}</p>
          )}

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            After clicking below you'll receive a payment address. Once your USDT is confirmed on-chain, a WhatsApp link will appear so you can finalise your order with Reesha.
          </p>
        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 flex gap-3 safe-bottom">
          <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Creating…' : `Pay $${price} USDT`}
          </button>
        </div>
      </form>
    </div>
  );
}
