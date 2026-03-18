import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type PromoBannerProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export function PromoBanner({ title, subtitle, imageUrl }: PromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copyBlock}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#22252E',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    minHeight: 160,
    overflow: 'hidden',
    paddingLeft: 22,
  },
  copyBlock: {
    flex: 1,
    gap: 10,
    paddingVertical: 24,
    zIndex: 1,
  },
  subtitle: {
    color: '#C9CCD6',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    maxWidth: 140,
  },
  image: {
    alignSelf: 'stretch',
    width: 150,
  },
});
