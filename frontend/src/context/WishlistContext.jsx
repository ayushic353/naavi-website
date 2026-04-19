import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistItems([]); return; }
    try {
      const { data } = await API.get('/wishlist');
      setWishlistItems(data.products || []);
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login to save items'); return; }
    try {
      const { data } = await API.post(`/wishlist/${productId}`);
      await fetchWishlist();
      toast.success(data.message);
    } catch { /* silent */ }
  };

  const isWishlisted = (productId) => wishlistItems.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
};
