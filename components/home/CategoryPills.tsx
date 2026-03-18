import { ScrollView, StyleSheet, Text, View } from 'react-native';

type CategoryPillsProps = {
  categories: string[];
};

export function CategoryPills({ categories }: CategoryPillsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {categories.map((category, index) => (
        <View key={`${category}-${index}`} style={[styles.pill, index === 0 && styles.activePill]}>
          <Text style={[styles.label, index === 0 && styles.activeLabel]}>{category}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
    marginBottom: 26,
  },
  pill: {
    backgroundColor: '#1B1B1B',
    borderColor: '#2B2B2B',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activePill: {
    backgroundColor: '#F0F0F0',
    borderColor: '#F0F0F0',
  },
  label: {
    color: '#C1C1C1',
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#111111',
  },
});
