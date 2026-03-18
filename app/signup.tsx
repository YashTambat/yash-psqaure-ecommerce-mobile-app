import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthInput } from '@/src/components/auth/AuthInput';
import { AuthScreenLayout } from '@/src/components/auth/AuthScreenLayout';

export default function SignupRoute() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <AuthScreenLayout
      ctaLabel="SIGN UP"
      fields={
        <>
          <AuthInput
            autoCapitalize="words"
            onChangeText={setName}
            placeholder="Enter your name"
            value={name}
          />
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
          <AuthInput
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
          />
        </>
      }
      footerLinkLabel="Log In"
      footerText="Already have account?"
      onCtaPress={() => router.replace('/(tabs)')}
      onFooterLinkPress={() => router.replace('/login')}
      titleLines={['Create', 'your account']}
    />
  );
}
