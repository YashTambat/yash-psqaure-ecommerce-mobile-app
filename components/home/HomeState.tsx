import { Pressable, StyleSheet, Text, View } from 'react-native';

type HomeStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function HomeState({ title, message, actionLabel, onActionPress }: HomeStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress ? (
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onActionPress}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 24,
    marginTop: 60,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    color: '#A8A8A8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F1F1F1',
    borderRadius: 999,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
});
