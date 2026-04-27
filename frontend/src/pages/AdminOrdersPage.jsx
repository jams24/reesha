import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOrders, approveOrder } from '../lib/api.js';

function CopyId({ id }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy transaction ID"
      className="group inline-flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-ink transition-colors"
    >
      <span className="truncate max-w-[140px]">{id}</span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? <path d="M5 12l4 4L19 7"/> : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>}
      </svg>
      {copied && <span className="text-green-600 text-[9px]">Copied!</span>}
    </button>
  );
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'FAILED', label: 'Failed' },
];

const NETWORK_LABELS = {
  USDT_ERC20: 'USDT / ERC-20',
  USDT_BEP20: 'USDT / BEP-20',
  USDC_BEP20: 'USDC / BEP-20',
  USDC_SOL:   'USDC / SOL',
};

function StatusBadge({ status }) {
  const styles = {
    PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    EXPIRED:   'bg-neutral-100 text-neutral-500 border-neutral-200',
    FAILED:    'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-block border text-[10px] uppercase tracking-widest2 px-2 py-0.5 ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const { admin, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const load = async (status = statusFilter) => {
    setLoading(true);
    try {
      const data = await fetchOrders(status ? { status } : {});
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  const onApprove = async (paymentId) => {
    if (!confirm('Manually mark this order as confirmed?')) return;
    setApprovingId(paymentId);
    try {
      await approveOrder(paymentId);
      setOrders((arr) =>
        arr.map((o) => o.paymentId === paymentId ? { ...o, status: 'CONFIRMED' } : o)
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve order');
    } finally {
      setApprovingId(null);
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-paper/95 backdrop-blur">
        <div className="container-x h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif italic text-xl sm:text-2xl">Reesha</span>
            <span className="text-[10px] uppercase tracking-widest2 text-neutral-500">Admin</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="text-neutral-500 text-xs truncate max-w-[200px]">{admin?.email}</span>
            <Link to="/admin" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink">Products</Link>
            <Link to="/" className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink">View store</Link>
            <button onClick={logout} className="text-[11px] uppercase tracking-widest2 hover:text-neutral-500">Sign out</button>
          </div>
          <button
            className="sm:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18"/> : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t border-neutral-200 bg-paper">
            <div className="container-x py-4 space-y-2">
              <p className="text-xs text-neutral-500 truncate">{admin?.email}</p>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-sm uppercase tracking-widest2 text-neutral-500">Products</Link>
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm uppercase tracking-widest2 text-neutral-500">View store</Link>
              <button onClick={logout} className="block py-2 text-sm uppercase tracking-widest2 text-left w-full">Sign out</button>
            </div>
          </div>
        )}
      </header>

      <div className="container-x py-6 sm:py-10">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div>
            <p className="eyebrow">Crypto payments</p>
            <h1 className="section-title mt-1">Orders</h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {loading ? 'Loading…' : `${total} total${pendingCount > 0 ? ` · ${pendingCount} pending` : ''}`}
            </p>
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-widest2 border transition-colors ${
                  statusFilter === f.value
                    ? 'bg-ink text-paper border-ink'
                    : 'border-neutral-300 hover:border-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-neutral-500 text-sm">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 px-4">
            <p className="eyebrow mb-3">No orders</p>
            <p className="text-sm text-neutral-600">
              {statusFilter ? `No ${statusFilter.toLowerCase()} orders yet.` : 'No crypto orders yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="md:hidden space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="border border-neutral-200 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{o.productName}</p>
                      {o.size && <p className="text-[11px] text-neutral-500">Size: {o.size}</p>}
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <p><span className="text-neutral-400">Customer:</span> {o.customerName}{o.customerPhone ? ` · ${o.customerPhone}` : ''}</p>
                    <p><span className="text-neutral-400">Amount:</span> ${o.cryptoPriceUsd} · {NETWORK_LABELS[o.currency] || o.currency}</p>
                    <p><span className="text-neutral-400">Date:</span> {new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase tracking-widest2 text-neutral-400">Txn ID:</span>
                    <CopyId id={o.paymentId} />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={o.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink underline"
                    >
                      Invoice
                    </a>
                    {o.status === 'CONFIRMED' && o.whatsappUrl && (
                      <a
                        href={o.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] uppercase tracking-widest2 text-green-700 hover:text-green-900 underline"
                      >
                        WhatsApp
                      </a>
                    )}
                    {o.status === 'PENDING' && (
                      <button
                        onClick={() => onApprove(o.paymentId)}
                        disabled={approvingId === o.paymentId}
                        className="text-[11px] uppercase tracking-widest2 text-ink hover:text-neutral-500 underline"
                      >
                        {approvingId === o.paymentId ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden md:block border border-neutral-200 bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-neutral-200 bg-neutral-50">
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Customer</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Product</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Amount</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Network</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Status</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Transaction ID</th>
                    <th className="py-3 px-4 text-[11px] uppercase tracking-widest2 font-normal">Date</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{o.customerName}</p>
                        {o.customerPhone && <p className="text-xs text-neutral-500">{o.customerPhone}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/product/${o.productSlug}`} target="_blank" className="hover:underline">
                          {o.productName}
                        </Link>
                        {o.size && <p className="text-xs text-neutral-500">Size: {o.size}</p>}
                      </td>
                      <td className="py-3 px-4 font-medium">${o.cryptoPriceUsd}</td>
                      <td className="py-3 px-4 text-xs text-neutral-600">{NETWORK_LABELS[o.currency] || o.currency}</td>
                      <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-4"><CopyId id={o.paymentId} /></td>
                      <td className="py-3 px-4 text-xs text-neutral-500 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-3">
                        <a
                          href={o.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink"
                        >
                          Invoice
                        </a>
                        {o.status === 'CONFIRMED' && o.whatsappUrl && (
                          <a
                            href={o.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] uppercase tracking-widest2 text-green-700 hover:text-green-900"
                          >
                            WhatsApp
                          </a>
                        )}
                        {o.status === 'PENDING' && (
                          <button
                            onClick={() => onApprove(o.paymentId)}
                            disabled={approvingId === o.paymentId}
                            className="text-[11px] uppercase tracking-widest2 text-ink hover:text-neutral-500"
                          >
                            {approvingId === o.paymentId ? 'Approving…' : 'Approve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
