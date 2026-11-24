"use client";

import { create } from "zustand";
import { CartItem, FurnitureConfiguration } from "@/types/furniture";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addItem: (config: any, customName?: string, category?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
  initCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  addItem: (config: FurnitureConfiguration, customName?: string, category: string = "Display Cabinets") => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: config.id,
      productName: customName || config.name,
      category,
      configuration: { ...config },
      quantity: 1,
      unitPrice: config.priceBreakdown.totalPrice,
    };

    const updated = [newItem, ...get().items];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_cart_items", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
      }
    }
    set({ items: updated, isOpen: true });
  },

  removeItem: (id: string) => {
    const updated = get().items.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_cart_items", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update cart in localStorage:", e);
      }
    }
    set({ items: updated });
  },

  updateQuantity: (id: string, delta: number) => {
    const updated = get().items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_cart_items", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update cart in localStorage:", e);
      }
    }
    set({ items: updated });
  },

  clearCart: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("fanus_cart_items");
      } catch (e) {
        console.error("Failed to clear cart:", e);
      }
    }
    set({ items: [] });
  },

  getTotalCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  initCart: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fanus_cart_items");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            set({ items: parsed });
          }
        }
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e);
      }
    }
  },
}));
