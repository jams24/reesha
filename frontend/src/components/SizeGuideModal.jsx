import { useEffect } from 'react';
import { sizeGuide } from '../data/sizeGuide.js';

function Table({ table }) {
  return (
    <div className="mt-4">
      <p className="eyebrow">{table.title}</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left">
              {table.headers.map((h) => (
                <th key={h} className="border-b border-neutral-200 py-2 pr-4 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="text-neutral-600">
                {r.map((cell, j) => (
                  <td key={j} className="border-b border-neutral-100 py-2 pr-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SizeGuideModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-paper max-w-2xl w-full relative my-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="p-8 sm:p-10">
          <p className="eyebrow">Reference</p>
          <h2 className="section-title mt-2">Size guide</h2>
          <p className="text-sm text-neutral-600 mt-3">
            Measurements in inches. Thrift items may vary — message us on WhatsApp for exact measurements on any piece.
          </p>

          <Table table={sizeGuide.tops} />
          <Table table={sizeGuide.jeansShorts} />
          <Table table={sizeGuide.skirts} />

          <p className="mt-6 text-xs text-neutral-500 italic">{sizeGuide.tip}</p>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
