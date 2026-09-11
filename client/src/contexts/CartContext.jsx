import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Computed values
  const itemCount = cart?.itemCount ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const items = useMemo(() => cart?.items ?? [], [cart]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/cart');
      setCart(res.data.data.cart);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart when user logs in/out
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async ({ productId, variantId, quantity = 1 }) => {
      setIsLoading(true);
      try {
        const res = await apiClient.post('/cart/items', { productId, variantId, quantity });
        setCart(res.data.data.cart);
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to add item to cart.';
        return { success: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateItem = useCallback(async (itemId, quantity) => {
    setIsLoading(true);
    try {
      const res = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
      setCart(res.data.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update cart.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setIsLoading(true);
    try {
      const res = await apiClient.delete(`/cart/items/${itemId}`);
      setCart(res.data.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ cart, items, itemCount, subtotal, isLoading, error, addItem, updateItem, removeItem, fetchCart }),
    [cart, items, itemCount, subtotal, isLoading, error, addItem, updateItem, removeItem, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
