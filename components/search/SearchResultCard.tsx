import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SearchProduct = {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
};

type SearchResultCardProps = {
  product: SearchProduct;
  onPress: () => void;
};

export function SearchResultCard({ product, onPress }: SearchResultCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image contentFit="cover" source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.category}>
          {product.category.name}
        </Text>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#181818',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    width: '48%',
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    backgroundColor: '#232323',
    height: 150,
    width: '100%',
  },
  content: {
    padding: 12,
  },
  category: {
    color: '#7F7F7F',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
    minHeight: 40,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
