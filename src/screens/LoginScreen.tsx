import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthInput } from '@/src/components/auth/AuthInput';
import { AuthScreenLayout } from '@/src/components/auth/AuthScreenLayout';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
      ctaLabel="LOG IN"
      fields={
        <>
          <AuthInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email address"
            value={email}
          />
          <AuthInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            value={password}
          />
        </>
      }
      footerLinkLabel="Sign Up"
      footerText="Don't have an account?"
      helperText="Forgot Password?"
      onCtaPress={() => router.replace('/welcome')}
      onFooterLinkPress={() => router.push('/signup')}
      titleLines={['Log into', 'your account']}
    />
  );
}
