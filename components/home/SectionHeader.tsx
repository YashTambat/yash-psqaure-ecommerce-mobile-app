import { Pressable, StyleSheet, Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ title, actionLabel = 'Show all' }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Pressable>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    color: '#A7A7A7',
    fontSize: 13,
  },
});
