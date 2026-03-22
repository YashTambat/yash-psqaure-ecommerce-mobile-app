import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import 'react-native-reanimated';

import { CartProvider, useCart } from '@/components/cart/cart-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/redux/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthReady, token } = useCart();

  useEffect(() => {
    if (!navigationState?.key || !isAuthReady) {
      return;
    }

    const isAuthEntryRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (token && isAuthEntryRoute) {
      router.replace('/(tabs)');
    }
  }, [isAuthReady, navigationState?.key, pathname, router, token]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/shipping" options={{ headerShown: false }} />
      <Stack.Screen name="checkout/payment" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <CartProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGate />
          <StatusBar style="auto" />
        </ThemeProvider>
      </CartProvider>
    </Provider>
  );
}
