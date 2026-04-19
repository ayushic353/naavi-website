import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); setCartTotal(0); return; }
    setCartLoading(true);
    try {
      const { data } = await API.get('/cart');
      setCartItems(data.items || []);
      setCartTotal(data.total || 0);
    } catch { /* silent */ } finally { setCartLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, size = '', color = '') => {
    if (!user) { toast.error('Please login to add items'); return; }
    try {
      await API.post('/cart', { productId, quantity, size, color });
      await fetchCart();
      toast.success('Added to bag');
    } catch (err) { toast.error(err.response?.data?.message || 'Could not add to bag'); }
  };

  const updateCartItem = async (itemId, quantity) => {
    try { await API.put(`/cart/${itemId}`, { quantity }); await fetchCart(); }
    catch { toast.error('Could not update'); }
  };

  const removeFromCart = async (itemId) => {
    try { await API.delete(`/cart/${itemId}`); await fetchCart(); toast.success('Removed'); }
    catch { toast.error('Could not remove'); }
  };

  const clearCart = async () => {
    try { await API.delete('/cart'); setCartItems([]); setCartTotal(0); }
    catch { /* silent */ }
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, cartLoading, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
