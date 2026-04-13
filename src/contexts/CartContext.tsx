"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  kitId?: string;
  variantName?: string;
  color?: string;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, kitId?: string, variation?: { color?: string, size?: string }, options?: { increment?: boolean }) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  total: number; // Alias for cartTotal
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("tiktok-shop-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tiktok-shop-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any, kitId?: string, variation?: { color?: string, size?: string }, options: { increment?: boolean } = { increment: true }) => {
    setCart((prev) => {
      const { color, size } = variation || {};
      const kId = kitId || "1";
      const cName = color || "none";
      const sName = size || "none";
      
      // Standardized Item ID
      const cartItemId = `${product.id}-${kId}-${cName}-${sName}`;
      
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        if (!options.increment) return prev; // Just ensure it's there, don't add more

        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      const kit = product.kits?.[kId] || Object.values(product.kits || {})[0];
      const price = kit?.price || product.price || 0;
      const originalPrice = kit?.originalPrice || product.originalPrice || (price * 1.5);
      
      const colorData = product.colors?.find((c: any) => c.name === color);
      const image = colorData?.image || kit?.image || product.image || product.carouselImages?.[0];
      const variantName = kit?.name || "";

      return [...prev, { 
        id: cartItemId, 
        name: product.name, 
        price: price,
        originalPrice: originalPrice,
        image: image,
        quantity: 1,
        kitId: kId,
        variantName: variantName,
        color: color,
        size: size
      }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      cartTotal,
      total: cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
