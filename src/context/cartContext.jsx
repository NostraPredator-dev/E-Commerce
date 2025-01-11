import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();

  const fetchCartFromBackend = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.get(`http://localhost:5000/cart/${currentUser.email}`);
      setCart(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart from backend:", error);
    }
  };

  const saveCartToBackend = async (updatedCart) => {
    if (!currentUser.email) return;
    try {
      await axios.post('http://localhost:5000/cart', {
        email: currentUser.email,
        items: updatedCart,
      });
    } catch (error) {
      console.error("Error saving cart to backend:", error);
    }
  };

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      return;
    }

    const updatedProduct = { ...product, quantity: 1 };
    const updatedCart = [...cart, updatedProduct];
    setCart(updatedCart);
    saveCartToBackend(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCartToBackend(updatedCart);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: quantity } : item
    );
    setCart(updatedCart);
    saveCartToBackend(updatedCart);
  };

  useEffect(() => {
    fetchCartFromBackend();
  }, [currentUser]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
