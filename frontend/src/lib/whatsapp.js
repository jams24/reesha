const NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2348161518807';

export function formatNaira(value) {
  const n = Number(value || 0);
  return `₦${n.toLocaleString('en-NG')}`;
}

export function buildWhatsAppOrderUrl(product, { size } = {}) {
  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `/product/${product.slug}`;

  const lines = [
    `Hi Reesha! I'd like to order:`,
    ``,
    `*Product*: ${product.name}`,
    size ? `*Size*: ${size}` : null,
    `*Price*: ${formatNaira(product.price)}`,
    `*Link*: ${productUrl}`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${NUMBER}?text=${text}`;
}

export function buildGeneralWhatsAppUrl(message = "Hi Reesha! I'd like to ask about your wears.") {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}
