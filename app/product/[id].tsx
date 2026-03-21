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
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.circleButton, styles.backButton, pressed && styles.circleButtonPressed]}>
          <Ionicons color="#FFFFFF" name="chevron-back" size={18} />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.circleButton, styles.favoriteButton, pressed && styles.circleButtonPressed]}>
          <Ionicons color="#FF5B6E" name="heart" size={16} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 118 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image contentFit="contain" source={{ uri: product.images[0] }} style={styles.heroImage} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingStars}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons key={index} color="#59C7B2" name="star" size={12} />
              ))}
            </View>
            <Text style={styles.reviewMeta}>({reviewCount})</Text>
          </View>

          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Color</Text>
            <View style={styles.colorRow}>
              {colorOptions.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorDotActive,
                  ]}
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
                  style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Ionicons color="#D6D6D6" name="chevron-down" size={16} />
            </View>
            <Text style={styles.description}>
              {product.description ||
                'Sportwear set is long-sleeve outerwear. It has a soft fabric body and a stylish silhouette that works for everyday wear.'}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Text style={styles.reviewAction}>WRITE A REVIEW</Text>
            </View>

            <View style={styles.scorePanel}>
              <View>
                <Text style={styles.scoreValue}>{rating.toFixed(1)}</Text>
                <Text style={styles.scoreScale}>out of 5</Text>
              </View>
              <View style={styles.reviewSummaryRight}>
                <View style={styles.ratingStars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons key={index} color="#59C7B2" name="star" size={12} />
                  ))}
                </View>
                <Text style={styles.barLabel}>{reviewCount} Reviews</Text>
              </View>
            </View>

            {[80, 12, 3, 0, 0].map((percent, index) => (
              <View key={`${5 - index}-${percent}`} style={styles.barRow}>
                <Text style={styles.barIndex}>{5 - index}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${percent}%` }]} />
                </View>
                <Text style={styles.barPercent}>{percent}%</Text>
              </View>
            ))}

            <Text style={styles.reviewCountText}>{reviewCount} Reviews</Text>

            <View style={styles.reviewList}>
              {staticReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.author.charAt(0)}</Text>
                  </View>
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewTopRow}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.ratingStars}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Ionicons key={index} color="#59C7B2" name="star" size={10} />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewMessage}>{review.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {similarProducts.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Similar Product</Text>
                <Ionicons color="#D6D6D6" name="chevron-down" size={16} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((item) => (
                  <ProductCard key={item.id} onPress={() => router.replace(`/product/${item.id}`)} product={item} />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <Pressable onPress={handleAddToCart} style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <Ionicons color="#111111" name="bag-handle-outline" size={18} />
          <Text style={styles.addButtonText}>Add To Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F6F1EA',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
  circleButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  backButton: {
    backgroundColor: '#1B1B1F',
  },
  favoriteButton: {
    backgroundColor: '#FFFFFF',
  },
  circleButtonPressed: {
    opacity: 0.82,
  },
  content: {
    paddingBottom: 140,
  },
  heroWrap: {
    alignItems: 'center',
    backgroundColor: '#F6F1EA',
    minHeight: 380,
    paddingBottom: 12,
    paddingTop: 28,
  },
  heroImage: {
    height: 360,
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#16171C',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -20,
    paddingHorizontal: 16,
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
    fontSize: 20,
    fontWeight: '600',
    paddingRight: 12,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewMeta: {
    color: '#8A8F98',
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
    color: '#B2B5BC',
    fontSize: 12,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorDot: {
    borderColor: 'transparent',
    borderRadius: 11,
    borderWidth: 2,
    height: 22,
    width: 22,
  },
  colorDotActive: {
    borderColor: '#FFFFFF',
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeChip: {
    alignItems: 'center',
    backgroundColor: '#22242B',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  sizeChipActive: {
    backgroundColor: '#FFFFFF',
  },
  sizeText: {
    color: '#B9BEC8',
    fontSize: 12,
    fontWeight: '600',
  },
  sizeTextActive: {
    color: '#111111',
  },
  section: {
    borderTopColor: '#2B2D34',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    paddingTop: 16,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#8D929C',
    fontSize: 11,
    lineHeight: 18,
  },
  reviewHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  reviewAction: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  scorePanel: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 42,
  },
  scoreScale: {
    color: '#8D929C',
    fontSize: 11,
    marginTop: 4,
  },
  reviewSummaryRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  barLabel: {
    color: '#8D929C',
    fontSize: 10,
  },
  barRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  barIndex: {
    color: '#C8CBD2',
    fontSize: 11,
    width: 12,
  },
  barTrack: {
    backgroundColor: '#2A2D34',
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
    color: '#8D929C',
    fontSize: 10,
    width: 30,
  },
  reviewCountText: {
    color: '#8D929C',
    fontSize: 10,
    marginTop: 8,
  },
  reviewList: {
    gap: 18,
    marginTop: 16,
  },
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewAvatar: {
    alignItems: 'center',
    backgroundColor: '#24262D',
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
  reviewTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewAuthor: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewMessage: {
    color: '#8D929C',
    fontSize: 11,
    lineHeight: 17,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  addButtonPressed: {
    opacity: 0.75,
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
