import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { useCart } from '@/components/cart/cart-context';
import { AuthInput } from '@/src/components/auth/AuthInput';
import { AuthScreenLayout } from '@/src/components/auth/AuthScreenLayout';
import { Api } from '@/src/config/api';

type LoginResponse = {
  message?: string;
  token?: string;
  name?: string;
  email?: string;
};

function parseLoginResponse(rawResponse: string) {
  if (!rawResponse) {
    return null;
  }

  try {
    return JSON.parse(rawResponse) as LoginResponse;
  } catch {
    return null;
  }
}

function getReadableResponseMessage(rawResponse: string, fallbackMessage: string) {
  const parsedResponse = parseLoginResponse(rawResponse);

  if (parsedResponse?.message) {
    return parsedResponse.message;
  }

  const cleanedResponse = rawResponse.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  return cleanedResponse || fallbackMessage;
}

export default function LoginRoute() {
  const router = useRouter();
  const { isAuthReady, setAuthSession, token } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthReady) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(Api.auth.login, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const rawResponse = await response.text();
      const data = parseLoginResponse(rawResponse);

      if (!response.ok || !data?.token || !data.name || !data.email) {
        throw new Error(getReadableResponseMessage(rawResponse, 'Unable to log in right now.'));
      }

      await setAuthSession({
        email: data.email,
        name: data.name,
        token: data.token,
      });

      router.replace('/(tabs)');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong while logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout
      ctaDisabled={!email.trim() || !password}
      ctaLabel="LOG IN"
      errorMessage={errorMessage}
      fields={
        <>
          <AuthInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email address"
            textContentType="emailAddress"
            value={email}
          />
          <AuthInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            value={password}
          />
        </>
      }
      footerLinkLabel="Sign Up"
      footerText="Don't have an account?"
      helperText="Forgot Password?"
      isSubmitting={isSubmitting}
      onCtaPress={handleLogin}
      onFooterLinkPress={() => router.push('/signup')}
      titleLines={['Log into', 'your account']}
    />
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    alignItems: 'center',
    backgroundColor: '#111111',
    flex: 1,
    justifyContent: 'center',
  },
});
