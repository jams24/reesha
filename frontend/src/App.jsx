import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { CartProvider } from './context/CartContext.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import PaymentStatusPage from './pages/PaymentStatusPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <CartProvider>
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/pay/:paymentId" element={<PaymentStatusPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
    </CartProvider>
  );
}
