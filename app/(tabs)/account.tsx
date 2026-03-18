import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

export default function AccountRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Account tab is connected and ready for profile work.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#111111',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9B9B9B',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
});
