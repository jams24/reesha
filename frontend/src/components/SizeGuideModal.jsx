import { useEffect } from 'react';
import { sizeGuide } from '../data/sizeGuide.js';

function Table({ table }) {
  return (
    <div className="mt-4">
      <p className="eyebrow">{table.title}</p>
      <div className="mt-2 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="text-left">
              {table.headers.map((h) => (
                <th key={h} className="border-b border-neutral-200 py-2 pr-4 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="text-neutral-600">
                {r.map((cell, j) => (
                  <td key={j} className="border-b border-neutral-100 py-2 pr-4 whitespace-nowrap">{cell}</td>
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
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4 overflow-y-auto">
      <div className="bg-paper w-full sm:max-w-2xl relative sm:my-8 flex flex-col min-h-screen sm:min-h-0" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-paper flex items-center justify-between px-5 sm:px-8 py-4 border-b border-neutral-200">
          <div>
            <p className="eyebrow">Reference</p>
            <p className="font-serif text-lg sm:text-xl mt-0.5">Size guide</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-neutral-500 hover:text-ink min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <p className="text-xs sm:text-sm text-neutral-600">
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
