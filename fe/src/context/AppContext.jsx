import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser as serviceLogout } from '../service/authService';
import { getCart, addToCart as serviceAddToCart, updateCartQty as serviceUpdateCartQty, removeFromCart as serviceRemoveFromCart, clearCart as serviceClearCart } from '../service/checkoutService';
import { CartMode } from '../type/cart';
import { analyzeMealImage, logMeal } from '../service/profileService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
  const [cartMode, setCartMode] = useState(CartMode.CLOSED);
  const [loading, setLoading] = useState(true);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  // Load initial session and cart
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const initialCart = getCart();
    setCart(initialCart);
    // Auto select all items when initializing cart
    setSelectedCartItemIds(initialCart.map(item => item.id));
    setLoading(false);
  }, []);

  const login = (sessionUser) => {
    setUser(sessionUser);
    // Reload cart for user
    const userCart = getCart();
    setCart(userCart);
    setSelectedCartItemIds(userCart.map(item => item.id));
  };

  const logout = () => {
    serviceLogout();
    setUser(null);
    setCart([]);
    setSelectedCartItemIds([]);
  };

  const updateSurveyStatus = (status) => {
    if (user) {
      const updatedUser = { ...user, has_surveyed: status };
      setUser(updatedUser);
    }
  };

  const startAILogMeal = async (file, onComplete) => {
    if (!user) return;
    setIsAIAnalyzing(true);
    try {
      const res = await analyzeMealImage(file);
      await logMeal(user.id, { ...res, source: 'AIImage' });
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      alert('AI không thể nhận diện được hình ảnh này.');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  // Cart actions
  const handleAddToCart = (item) => {
    const updatedCart = serviceAddToCart(item);
    setCart([...updatedCart]);
    
    // Find the generated id for the newly added item
    const addedItem = updatedCart.find(
      c => c.dish_id === item.dish_id && c.size_name === item.size_name && c.chef_notes === item.chef_notes
    );
    
    if (addedItem && !selectedCartItemIds.includes(addedItem.id)) {
      setSelectedCartItemIds(prev => [...prev, addedItem.id]);
    }
    // Auto open minicart to notify user
    setCartMode(CartMode.PINNED);
  };

  const handleAddMultipleToCart = (items) => {
    let currentCart = [...cart];
    const newAddedIds = [];

    items.forEach((item) => {
      currentCart = serviceAddToCart(item);
      const addedItem = currentCart.find(
        c => c.dish_id === item.dish_id && c.size_name === item.size_name && c.chef_notes === item.chef_notes
      );
      if (addedItem && !selectedCartItemIds.includes(addedItem.id) && !newAddedIds.includes(addedItem.id)) {
        newAddedIds.push(addedItem.id);
      }
    });

    setCart(currentCart);
    if (newAddedIds.length > 0) {
      setSelectedCartItemIds(prev => [...prev, ...newAddedIds]);
    }
    setCartMode(CartMode.PINNED);
  };

  const handleUpdateQty = (id, qty) => {
    const updatedCart = serviceUpdateCartQty(id, qty);
    setCart([...updatedCart]);
  };

  const handleRemove = (id) => {
    const updatedCart = serviceRemoveFromCart(id);
    setCart([...updatedCart]);
    // Also remove from selection
    setSelectedCartItemIds(prev => prev.filter(itemId => itemId !== id));
  };

  const handleClearCart = () => {
    serviceClearCart();
    setCart([]);
    setSelectedCartItemIds([]);
  };

  const toggleSelectCartItem = (id) => {
    setSelectedCartItemIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const toggleSelectAllCartItems = () => {
    if (selectedCartItemIds.length === cart.length) {
      setSelectedCartItemIds([]);
    } else {
      setSelectedCartItemIds(cart.map(item => item.id));
    }
  };

  const getCartTotals = (onlySelected = false) => {
    const itemsToCalculate = onlySelected 
      ? cart.filter(item => selectedCartItemIds.includes(item.id)) 
      : cart;
      
    return itemsToCalculate.reduce(
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
        selectedCartItemIds,
        cartMode,
        setCartMode,
        loading,
        isAIAnalyzing,
        login,
        logout,
        updateSurveyStatus,
        startAILogMeal,
        addToCart: handleAddToCart,
        addMultipleToCart: handleAddMultipleToCart,
        updateCartQty: handleUpdateQty,
        removeFromCart: handleRemove,
        clearCart: handleClearCart,
        toggleSelectCartItem,
        toggleSelectAllCartItems,
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
