import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { authTheme } from '@/src/utils/auth-theme';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.copyBlock}>
          <Text style={styles.eyebrow}>Welcome</Text>
          <Text style={styles.title}>You&apos;re signed in.</Text>
          <Text style={styles.description}>
            Your login flow is ready, and this screen is now the first destination after authentication.
          </Text>
        </View>

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: authTheme.background,
    flex: 1,
  },
  container: {
    backgroundColor: authTheme.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  copyBlock: {
    gap: 16,
    marginTop: 40,
  },
  eyebrow: {
    color: '#8F8F8F',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: authTheme.textPrimary,
    fontSize: 34,
    fontWeight: '700',
  },
  description: {
    color: authTheme.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  button: {
    alignItems: 'center',
    backgroundColor: authTheme.buttonBackground,
    borderRadius: 999,
    paddingVertical: 18,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: authTheme.buttonText,
    fontSize: 18,
    fontWeight: '700',
  },
});
