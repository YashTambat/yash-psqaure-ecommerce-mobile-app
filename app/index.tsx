import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 250,
    height: 250,
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
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
