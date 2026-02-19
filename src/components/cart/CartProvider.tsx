"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CART_STORAGE_KEY = "thelaseragent-cart";

export const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Corrupted data, start fresh
  }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage after mount
  useEffect(() => {
    setCartItems(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isHydrated]);

  const addItem = useCallback((product: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    setCartItems((prev) => prev.filter((item) => item.slug !== productSlug));
  }, []);

  const updateQuantity = useCallback(
    (productSlug: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productSlug);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.slug === productSlug ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
