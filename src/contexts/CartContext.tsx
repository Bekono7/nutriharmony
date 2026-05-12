import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { resolveMediaUrl, type Dish } from "@/lib/api";

export type CartItem = {
  dishId: number;
  name: string;
  price: string; // decimal as string
  imageUrl?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  addDish: (dish: Dish, quantity?: number) => void;
  setQuantity: (dishId: number, quantity: number) => void;
  remove: (dishId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "nutriharmony_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

function safeParse(json: string | null): CartItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => ({
        dishId: Number(x?.dishId),
        name: String(x?.name ?? ""),
        price: String(x?.price ?? "0"),
        imageUrl: x?.imageUrl ? String(x.imageUrl) : undefined,
        quantity: Math.max(1, Number(x?.quantity ?? 1)),
      }))
      .filter((x) => Number.isFinite(x.dishId) && x.dishId > 0 && x.name);
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => safeParse(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);
  }, [items]);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);

  const value: CartContextType = {
    items,
    total,
    count,
    addDish: (dish, quantity = 1) => {
      const id = dish.id;
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.dishId === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            dishId: id,
            name: dish.name,
            price: String(dish.price ?? "0"),
            imageUrl: resolveMediaUrl(dish.image_url) ?? undefined,
            quantity,
          },
        ];
      });
    },
    setQuantity: (dishId, quantity) => {
      setItems((prev) =>
        prev
          .map((it) =>
            it.dishId === dishId ? { ...it, quantity: Math.max(1, quantity) } : it,
          )
          .filter((it) => it.quantity > 0),
      );
    },
    remove: (dishId) => setItems((prev) => prev.filter((x) => x.dishId !== dishId)),
    clear: () => setItems([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

