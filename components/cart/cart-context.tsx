import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { clearStoredAuthSession, getStoredAuthSession, storeAuthSession } from '@/src/utils/auth-storage';

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

export type AccountProfile = {
  name: string;
  email: string;
};

export type AuthSession = AccountProfile & {
  token: string;
};

export type OrderItem = CartItem;

export type OrderSummary = {
  id: string;
  placedAt: string;
  total: number;
  itemCount: number;
  items: OrderItem[];
};

type CartContextValue = {
  items: CartItem[];
  orders: OrderSummary[];
  profile: AccountProfile;
  token: string | null;
  isAuthReady: boolean;
  addItem: (item: CartProduct) => void;
  increaseQuantity: (cartKey: string) => void;
  decreaseQuantity: (cartKey: string) => void;
  removeItem: (cartKey: string) => void;
  placeOrder: () => OrderSummary | null;
  setAuthSession: (session: AuthSession) => Promise<void>;
  clearAuthSession: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const defaultProfile: AccountProfile = {
  name: 'Guest User',
  email: 'Sign in to view your profile',
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [profile, setProfile] = useState<AccountProfile>(defaultProfile);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuthSession = async () => {
      try {
        const session = await getStoredAuthSession();

        if (!isMounted || !session) {
          return;
        }

        setProfile({ email: session.email, name: session.name });
        setToken(session.token);
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    hydrateAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      orders,
      profile,
      token,
      isAuthReady,
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
        setItems((currentItems) => currentItems.filter((item) => item.cartKey !== cartKey));
      },
      placeOrder: () => {
        if (items.length === 0) {
          return null;
        }

        const order: OrderSummary = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          itemCount: items.reduce((total, item) => total + item.quantity, 0),
          items: items.map((item) => ({ ...item })),
          placedAt: new Date().toISOString(),
          total: items.reduce((total, item) => total + item.price * item.quantity, 0),
        };

        setOrders((currentOrders) => [order, ...currentOrders]);
        setItems([]);

        return order;
      },
      setAuthSession: async (session) => {
        setProfile({ email: session.email, name: session.name });
        setToken(session.token);
        await storeAuthSession(session);
      },
      clearAuthSession: async () => {
        setProfile(defaultProfile);
        setToken(null);
        await clearStoredAuthSession();
      },
    }),
    [isAuthReady, items, orders, profile, token]
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
