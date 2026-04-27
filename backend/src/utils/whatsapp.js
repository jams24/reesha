const NUMBER = process.env.WHATSAPP_NUMBER || '2348161518807';

const NETWORK_LABELS = {
  USDT_ERC20: 'USDT (Ethereum / ERC-20)',
  USDT_BEP20: 'USDT (BNB Smart Chain / BEP-20)',
};

exports.buildCryptoWhatsAppUrl = (order) => {
  const network = NETWORK_LABELS[order.currency] || order.currency;
  const lines = [
    `Hi Reesha! I just paid via crypto.`,
    ``,
    `*Product*: ${order.productName}`,
    order.size ? `*Size*: ${order.size}` : null,
    `*Amount*: $${order.cryptoPriceUsd} via ${network}`,
    `*Payment ID*: ${order.paymentId}`,
    ``,
    `Please confirm and arrange delivery. Thank you!`,
  ].filter((l) => l !== null);

  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
};
