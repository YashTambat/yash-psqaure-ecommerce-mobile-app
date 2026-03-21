import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useCart } from '@/components/cart/cart-context';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthReady, token } = useCart();

  const handleGetStarted = () => {
    router.replace(token ? '/(tabs)' : '/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/images/image3.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <Pressable
          disabled={!isAuthReady}
          style={({ pressed }) => [
            styles.button,
            !isAuthReady && styles.buttonDisabled,
            pressed && isAuthReady && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          {isAuthReady ? (
            <>
              <Text style={styles.buttonText}>{token ? 'Continue' : 'Get Started'}</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </>
          ) : (
            <ActivityIndicator color="#000000" />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '78%',
    maxWidth: 420,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
