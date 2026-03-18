import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/redux/productsSlice';

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Image
        source={{ uri: product.images[0] }}
        style={[styles.image, compact && styles.compactImage]}
        contentFit="cover"
      />
      <Text numberOfLines={2} style={styles.title}>
        {product.title}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 14,
    width: 132,
  },
  compactCard: {
    width: 160,
  },
  image: {
    backgroundColor: '#1F1F1F',
    borderRadius: 18,
    height: 156,
    marginBottom: 10,
    width: 132,
  },
  compactImage: {
    height: 92,
    width: 160,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
