import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPills } from '@/components/home/CategoryPills';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeState } from '@/components/home/HomeState';
import { ProductCard } from '@/components/home/ProductCard';
import { PromoBanner } from '@/components/home/PromoBanner';
import { SectionHeader } from '@/components/home/SectionHeader';
import { loadProducts } from '@/redux/productsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export default function HomeRoute() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts());
    }
  }, [dispatch, status]);

  const categories = Array.from(new Set(items.map((product) => product.category.name))).slice(0, 5);
  const featureProducts = items.slice(0, 6);
  const recommendedProducts = items.slice(6, 12);
  const topCollection = items.slice(12, 16);
  const heroImage = featureProducts[0]?.images[0];
  const collectionProduct = recommendedProducts[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader title="Stylinx" subtitle="Discover your next favorite look" />

        {categories.length > 0 ? <CategoryPills categories={categories} /> : null}

        {status === 'loading' ? (
          <HomeState title="Loading products" message="We’re pulling the latest catalog for your home feed." />
        ) : null}

        {status === 'failed' ? (
          <HomeState
            title="Couldn’t load products"
            message={error ?? 'Something went wrong while loading the catalog.'}
            actionLabel="Try again"
            onActionPress={() => dispatch(loadProducts())}
          />
        ) : null}

        {status === 'succeeded' ? (
          <>
            <PromoBanner imageUrl={heroImage} subtitle="New Collection" title="Autumn Collection 2021" />

            <SectionHeader title="Feature Products" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {featureProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ScrollView>

            <View style={styles.collectionBanner}>
              <View style={styles.collectionCopy}>
                <Text style={styles.collectionEyebrow}>New Collection</Text>
                <Text style={styles.collectionTitle}>Hang Out{'\n'}& Party</Text>
              </View>
              {collectionProduct ? (
                <View style={styles.collectionImageWrap}>
                  <ProductCard product={collectionProduct} compact />
                </View>
              ) : null}
            </View>

            <SectionHeader title="Recommended" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </ScrollView>

            <SectionHeader title="Top Collection" />
            <View style={styles.stack}>
              {topCollection.map((product, index) => (
                <View key={product.id} style={[styles.collectionCard, index === 0 && styles.collectionCardAccent]}>
                  <View style={styles.collectionTextWrap}>
                    <Text style={styles.collectionCategory}>{product.category.name}</Text>
                    <Text style={styles.collectionName}>{product.title}</Text>
                  </View>
                  <View style={styles.collectionPreview}>
                    <ProductCard product={product} compact />
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#111111',
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  horizontalList: {
    paddingBottom: 28,
  },
  collectionBanner: {
    backgroundColor: '#262A34',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    marginTop: 6,
    overflow: 'hidden',
    paddingLeft: 20,
  },
  collectionCopy: {
    justifyContent: 'center',
    paddingVertical: 22,
  },
  collectionEyebrow: {
    color: '#AAAAAA',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  collectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  collectionImageWrap: {
    justifyContent: 'center',
    marginRight: -12,
    paddingVertical: 10,
  },
  stack: {
    gap: 14,
  },
  collectionCard: {
    alignItems: 'center',
    backgroundColor: '#1A1E28',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingLeft: 18,
  },
  collectionCardAccent: {
    backgroundColor: '#2B2F3A',
  },
  collectionTextWrap: {
    flex: 1,
    gap: 10,
    paddingVertical: 18,
    paddingRight: 12,
  },
  collectionCategory: {
    color: '#8E93A2',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  collectionName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  collectionPreview: {
    marginRight: -18,
  },
});
