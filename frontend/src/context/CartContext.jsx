import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reesha_cart') || '[]'); }
    catch { return []; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('reesha_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size) => {
    const cartId = `${product.id}-${size || 'one-size'}`;
    setItems((prev) => {
      if (prev.find((i) => i.cartId === cartId)) return prev;
      return [...prev, {
        cartId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        cryptoPriceUsd: product.cryptoPriceUsd || null,
        size: size || null,
      }];
    });
    setDrawerOpen(true);
  };

  const removeItem = (cartId) => setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  const clearCart = () => setItems([]);
  const isInCart = (productId, size) => items.some((i) => i.cartId === `${productId}-${size || 'one-size'}`);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, total, count, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
