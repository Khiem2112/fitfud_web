import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser as serviceLogout } from '../service/authService';
import { getCart, addToCart as serviceAddToCart, updateCartQty as serviceUpdateCartQty, removeFromCart as serviceRemoveFromCart, clearCart as serviceClearCart } from '../service/checkoutService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial session and cart
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const initialCart = getCart();
    setCart(initialCart);
    setLoading(false);
  }, []);

  const login = (sessionUser) => {
    setUser(sessionUser);
    // Reload cart for user
    setCart(getCart());
  };

  const logout = () => {
    serviceLogout();
    setUser(null);
    setCart([]);
  };

  const updateSurveyStatus = (status) => {
    if (user) {
      const updatedUser = { ...user, has_surveyed: status };
      setUser(updatedUser);
    }
  };

  // Cart actions
  const handleAddToCart = (item) => {
    const updatedCart = serviceAddToCart(item);
    setCart([...updatedCart]);
    // Auto open minicart to notify user
    setCartOpen(true);
  };

  const handleUpdateQty = (id, qty) => {
    const updatedCart = serviceUpdateCartQty(id, qty);
    setCart([...updatedCart]);
  };

  const handleRemove = (id) => {
    const updatedCart = serviceRemoveFromCart(id);
    setCart([...updatedCart]);
  };

  const handleClearCart = () => {
    serviceClearCart();
    setCart([]);
  };

  const getCartTotals = () => {
    return cart.reduce(
      (totals, item) => {
        totals.amount += item.price * item.quantity;
        totals.count += item.quantity;
        totals.calories += (item.calories || 0) * item.quantity;
        totals.protein += (item.protein || 0) * item.quantity;
        totals.carb += (item.carb || 0) * item.quantity;
        totals.fat += (item.fat || 0) * item.quantity;
        return totals;
      },
      { amount: 0, count: 0, calories: 0, protein: 0, carb: 0, fat: 0 }
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        cartOpen,
        setCartOpen,
        loading,
        login,
        logout,
        updateSurveyStatus,
        addToCart: handleAddToCart,
        updateCartQty: handleUpdateQty,
        removeFromCart: handleRemove,
        clearCart: handleClearCart,
        getCartTotals
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
