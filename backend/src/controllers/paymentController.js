const crypto = require('crypto');
const prisma = require('../config/db');
const { buildCryptoWhatsAppUrl } = require('../utils/whatsapp');

const INVENTPAY_API_KEY = process.env.INVENTPAY_API_KEY;
const INVENTPAY_WEBHOOK_SECRET = process.env.INVENTPAY_WEBHOOK_SECRET;
const INVENTPAY_BASE = 'https://api.inventpay.io/v1';

const ALLOWED_CURRENCIES = ['USDT_ERC20', 'USDT_BEP20'];

async function inventpayPost(path, body) {
  const res = await fetch(`${INVENTPAY_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': INVENTPAY_API_KEY,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw Object.assign(new Error(json.error || 'InventPay error'), { status: res.status, body: json });
  return json;
}

exports.createPayment = async (req, res) => {
  const { productId, size, customerName, customerPhone, currency } = req.body;

  if (!productId || !customerName || !currency) {
    return res.status(400).json({ error: 'productId, customerName, and currency are required' });
  }
  if (!ALLOWED_CURRENCIES.includes(currency)) {
    return res.status(400).json({ error: 'currency must be USDT_ERC20 or USDT_BEP20' });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.cryptoPriceUsd) return res.status(400).json({ error: 'Crypto payment not available for this product' });
  if (product.stock === 0) return res.status(400).json({ error: 'This item is sold out' });
  if (product.sizes?.length > 0 && !size) return res.status(400).json({ error: 'Please select a size' });

  const webhookUrl =
    process.env.INVENTPAY_WEBHOOK_URL ||
    `${req.protocol}://${req.get('host')}/api/payments/webhook`;

  const ipRes = await inventpayPost('/create_payment', {
    amount: product.cryptoPriceUsd,
    amountCurrency: 'USD',
    currency,
    description: `${product.name}${size ? ` (${size})` : ''} — ${customerName}`,
    callbackUrl: webhookUrl,
    expirationMinutes: 60,
  });

  const { paymentId, invoiceUrl } = ipRes.data;

  await prisma.order.create({
    data: {
      paymentId,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      cryptoPriceUsd: product.cryptoPriceUsd,
      currency,
      size: size || null,
      customerName,
      customerPhone: customerPhone || null,
      status: 'PENDING',
      invoiceUrl,
    },
  });

  res.json({ paymentId, invoiceUrl });
};

exports.handleWebhook = async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  if (INVENTPAY_WEBHOOK_SECRET && signature) {
    const expected = crypto
      .createHmac('sha256', INVENTPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const { event, data } = req.body || {};
  if (!event || !data?.paymentId) return res.json({ ok: true });

  const STATUS_MAP = {
    'payment.confirmed': 'CONFIRMED',
    'payment.completed': 'CONFIRMED',
    'payment.expired': 'EXPIRED',
    'payment.failed': 'FAILED',
  };

  const newStatus = STATUS_MAP[event];
  if (newStatus) {
    await prisma.order.updateMany({
      where: { paymentId: data.paymentId, status: 'PENDING' },
      data: { status: newStatus },
    });
  }

  res.json({ ok: true });
};

exports.getPaymentStatus = async (req, res) => {
  const order = await prisma.order.findUnique({ where: { paymentId: req.params.paymentId } });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const whatsappUrl = order.status === 'CONFIRMED' ? buildCryptoWhatsAppUrl(order) : null;

  res.json({
    status: order.status,
    invoiceUrl: order.invoiceUrl,
    productName: order.productName,
    productSlug: order.productSlug,
    cryptoPriceUsd: order.cryptoPriceUsd,
    currency: order.currency,
    size: order.size,
    customerName: order.customerName,
    whatsappUrl,
    createdAt: order.createdAt,
  });
};
