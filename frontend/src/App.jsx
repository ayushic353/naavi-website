import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Layout from './components/organisms/Layout';
import HomePage from './components/pages/HomePage';
import ShopPage from './components/pages/ShopPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import CartPage from './components/pages/CartPage';

import {
  LoginPage,
  RegisterPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
  WishlistPage,
  ProfilePage,
  AboutPage,
  ContactPage,
  HelpPage,
  AdminPage,
  NotFoundPage,
} from './components/pages/AllPages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1e1e1e',
                  color: '#e8e4de',
                  border: '1px solid #3d3d3d',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#c9a96e', secondary: '#0a0a0a' } },
                error: { iconTheme: { primary: '#c45c3a', secondary: '#0a0a0a' } },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />
              <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
              <Route path="/login" element={<Layout><LoginPage /></Layout>} />
              <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
              <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
              <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />
              <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/help" element={<Layout><HelpPage /></Layout>} />
              <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
              <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
