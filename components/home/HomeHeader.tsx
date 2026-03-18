import { StyleSheet, Text, View } from 'react-native';

type HomeHeaderProps = {
  title: string;
  subtitle: string;
};

export function HomeHeader({ title, subtitle }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 22,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9F9F9F',
    fontSize: 14,
    textAlign: 'center',
  },
});
