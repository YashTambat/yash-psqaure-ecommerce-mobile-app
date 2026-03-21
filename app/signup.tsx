import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthInput } from '@/src/components/auth/AuthInput';
import { AuthScreenLayout } from '@/src/components/auth/AuthScreenLayout';
import { Api } from '@/src/config/api';

type RegisterResponse = {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

function parseRegisterResponse(rawResponse: string) {
  if (!rawResponse) {
    return null;
  }

  try {
    return JSON.parse(rawResponse) as RegisterResponse;
  } catch {
    return null;
  }
}

function getReadableResponseMessage(rawResponse: string, fallbackMessage: string) {
  const parsedResponse = parseRegisterResponse(rawResponse);

  if (parsedResponse?.message) {
    return parsedResponse.message;
  }

  const cleanedResponse = rawResponse
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanedResponse || fallbackMessage;
}

export default function SignupRoute() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password must match.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(Api.auth.register, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          password,
        }),
      });

      const rawResponse = await response.text();
      const data = parseRegisterResponse(rawResponse);

      if (!response.ok) {
        throw new Error(getReadableResponseMessage(rawResponse, 'Unable to create your account right now.'));
      }

      if (!data?.user) {
        throw new Error(getReadableResponseMessage(rawResponse, 'Unexpected response from register API.'));
      }

      router.replace('/login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong while signing up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout
      ctaDisabled={!name.trim() || !email.trim() || !password || !confirmPassword}
      ctaLabel="SIGN UP"
      errorMessage={errorMessage}
      fields={
        <>
          <AuthInput
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={setName}
            placeholder="Enter your name"
            textContentType="name"
            value={name}
          />
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
            autoComplete="password-new"
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="newPassword"
            value={password}
          />
          <AuthInput
            autoCapitalize="none"
            autoComplete="password-new"
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
          />
        </>
      }
      footerLinkLabel="Log In"
      footerText="Already have account?"
      isSubmitting={isSubmitting}
      onCtaPress={handleSignup}
      onFooterLinkPress={() => router.replace('/login')}
      titleLines={['Create', 'your account']}
    />
  );
}
