const KEY = 'reesha_wishlist';
const EVENT = 'reesha:wishlist-change';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getWishlist() { return read(); }

export function isInWishlist(slug) {
  return read().some((item) => item.slug === slug);
}

export function addToWishlist(product) {
  const items = read();
  if (items.some((it) => it.slug === product.slug)) return;
  items.unshift({
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images?.[0] || null,
    addedAt: Date.now(),
  });
  write(items);
}

export function removeFromWishlist(slug) {
  write(read().filter((it) => it.slug !== slug));
}

export function toggleWishlist(product) {
  if (isInWishlist(product.slug)) {
    removeFromWishlist(product.slug);
    return false;
  }
  addToWishlist(product);
  return true;
}

export function onWishlistChange(handler) {
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
