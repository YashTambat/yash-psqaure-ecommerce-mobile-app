import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
};

export type CartItem = CartProduct & {
  cartKey: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartProduct) => void;
  increaseQuantity: (cartKey: string) => void;
  decreaseQuantity: (cartKey: string) => void;
  removeItem: (cartKey: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        setItems((currentItems) => {
          const cartKey = `${item.id}-${item.size}-${item.color}`;
          const existingItem = currentItems.find((currentItem) => currentItem.cartKey === cartKey);

          if (existingItem) {
            return currentItems.map((currentItem) =>
              currentItem.cartKey === cartKey
                ? { ...currentItem, quantity: currentItem.quantity + 1 }
                : currentItem
            );
          }

          return [...currentItems, { ...item, cartKey, quantity: 1 }];
        });
      },
      increaseQuantity: (id) => {
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.cartKey === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      },
      decreaseQuantity: (id) => {
        setItems((currentItems) =>
          currentItems
            .map((item) => (item.cartKey === id ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (cartKey) => {
        setItems((currentItems) =>
          currentItems.filter((item) => item.cartKey !== cartKey)
        );
      },
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}
