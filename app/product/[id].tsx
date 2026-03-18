import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ProductCard } from '@/components/home/ProductCard';
import { useCart } from '@/components/cart/cart-context';
import type { Product } from '@/redux/productsSlice';
import { useAppSelector } from '@/redux/store';

const PRODUCT_URL = 'https://api.escuelajs.co/api/v1/products';

const staticReviews = [
  {
    id: 1,
    author: 'Jennifer Rose',
    message:
      'I love it. Awesome product and it helped me create new styling ideas without feeling heavy on the body.',
  },
  {
    id: 2,
    author: 'Kelly Hanna',
    message: 'Fit was pretty comfortable and the texture was good quality. Recommended.',
  },
];

const colorOptions = ['#F1D7C6', '#1D1D1F', '#E2606E'];
const sizeOptions = ['S', 'M', 'L'];

export default function ProductDetailsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const parsedId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[1]);
  const { addItem } = useCart();
  const allProducts = useAppSelector((state) => state.products.items);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setStatus('loading');

      try {
        const response = await fetch(`${PRODUCT_URL}/${parsedId}`);

        if (!response.ok) {
          throw new Error('Unable to load product details.');
        }

        const data = (await response.json()) as Product;

        if (isMounted) {
          setProduct(data);
          setStatus('succeeded');
        }
      } catch {
        if (isMounted) {
          setStatus('failed');
        }
      }
    }

    if (Number.isFinite(parsedId)) {
      void loadProduct();
    } else {
      setStatus('failed');
    }

    return () => {
      isMounted = false;
    };
  }, [parsedId]);

  const similarProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return allProducts
      .filter((item) => item.category.id === product.category.id && item.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const rating = 4.9;
  const reviewCount = 83;

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    });

    router.push('/(tabs)/cart');
  };

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingState}>
          <ActivityIndicator color="#111111" />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'failed' || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>Could not load product</Text>
          <Text style={styles.errorText}>Please go back and try another product.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.circleButton}>
          <Ionicons color="#111111" name="chevron-back" size={18} />
        </Pressable>
        <Pressable style={styles.circleButton}>
          <Ionicons color="#FF6B81" name="heart" size={16} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 130 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image contentFit="cover" source={{ uri: product.images[0] }} style={styles.heroImage} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.starText}>★★★★★</Text>
            <Text style={styles.reviewMeta}>({reviewCount})</Text>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Color</Text>
            <View style={styles.colorRow}>
              {colorOptions.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotActive]}
                />
              ))}
            </View>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Size</Text>
            <View style={styles.sizeRow}>
              {sizeOptions.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}>
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description ||
                'Sportwear set is long-sleeve outerwear. It has a soft fabric body and a stylish silhouette that works for everyday wear.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>{rating.toFixed(1)}</Text>
              <Text style={styles.scoreScale}>out of 5</Text>
            </View>
            <Text style={styles.barLabel}>Sizing and comfort feedback</Text>
            {[92, 78, 65, 31, 25].map((percent, index) => (
              <View key={percent} style={styles.barRow}>
                <Text style={styles.barIndex}>{5 - index}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${percent}%` }]} />
                </View>
                <Text style={styles.barPercent}>{percent}%</Text>
              </View>
            ))}

            <View style={styles.reviewList}>
              {staticReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.author.charAt(0)}</Text>
                  </View>
                  <View style={styles.reviewContent}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <Text style={styles.reviewMessage}>{review.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {similarProducts.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Product</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((item) => (
                  <ProductCard key={item.id} onPress={() => router.replace(`/product/${item.id}`)} product={item} />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { bottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={handleAddToCart} style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <Ionicons color="#111111" name="bag-handle-outline" size={20} />
          <Text style={styles.addButtonText}>Add To Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F4EFE8',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 6,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  circleButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFFD9',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    paddingBottom: 140,
  },
  heroWrap: {
    alignItems: 'center',
    backgroundColor: '#F4EFE8',
    paddingBottom: 10,
    paddingTop: 40,
  },
  heroImage: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    height: 360,
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    paddingRight: 12,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starText: {
    color: '#4EC9B0',
    fontSize: 13,
    letterSpacing: 1.2,
  },
  reviewMeta: {
    color: '#818181',
    fontSize: 12,
    marginLeft: 8,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionLabel: {
    color: '#9B9B9B',
    fontSize: 13,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorDot: {
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    width: 20,
  },
  colorDotActive: {
    borderColor: '#FFFFFF',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeChip: {
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  sizeChipActive: {
    backgroundColor: '#FFFFFF',
  },
  sizeText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '600',
  },
  sizeTextActive: {
    color: '#111111',
  },
  section: {
    borderTopColor: '#262626',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    paddingTop: 18,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  description: {
    color: '#9A9A9A',
    fontSize: 13,
    lineHeight: 22,
  },
  scoreRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  scoreScale: {
    color: '#9B9B9B',
    fontSize: 13,
    marginBottom: 6,
  },
  barLabel: {
    color: '#7A7A7A',
    fontSize: 12,
    marginBottom: 12,
  },
  barRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  barIndex: {
    color: '#B8B8B8',
    fontSize: 12,
    width: 12,
  },
  barTrack: {
    backgroundColor: '#222222',
    borderRadius: 999,
    flex: 1,
    height: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  barPercent: {
    color: '#7D7D7D',
    fontSize: 11,
    width: 32,
  },
  reviewList: {
    gap: 16,
    marginTop: 18,
  },
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewAvatar: {
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewContent: {
    flex: 1,
  },
  reviewAuthor: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewMessage: {
    color: '#8E8E8E',
    fontSize: 12,
    lineHeight: 20,
  },
  bottomBar: {
    backgroundColor: '#FFFFFFF2',
    borderRadius: 24,
    left: 16,
    padding: 12,
    position: 'absolute',
    right: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#F1EDE5',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#111111',
    marginTop: 12,
  },
  errorState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorText: {
    color: '#5F5F5F',
    textAlign: 'center',
  },
});
