import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [cart, setCart] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || isAdmin) {
      setCart(null);
      return;
    }
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addItem(productId, quantity) {
    const data = await cartService.addItem(productId, quantity);
    setCart(data);
    return data;
  }

  async function updateItem(itemId, quantity) {
    const data = await cartService.updateItem(itemId, quantity);
    setCart(data);
    return data;
  }

  async function removeItem(itemId) {
    const data = await cartService.removeItem(itemId);
    setCart(data);
    return data;
  }

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const value = { cart, itemCount, refreshCart, addItem, updateItem, removeItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
