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

export function buildWhatsAppCartUrl(items) {
  const lines = [
    `Hi Reesha! I'd like to order the following:`,
    ``,
    ...items.map((item, i) => {
      const size = item.size ? ` (Size: ${item.size})` : '';
      return `${i + 1}. *${item.name}*${size} — ${formatNaira(item.price)}`;
    }),
    ``,
    `*Total: ${formatNaira(items.reduce((s, i) => s + i.price, 0))}*`,
    ``,
    `Please confirm availability and arrange delivery. Thank you!`,
  ];
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
