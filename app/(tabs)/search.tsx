import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SearchResultCard } from '@/components/search/SearchResultCard';

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
};

const PRODUCTS_URL = 'https://api.escuelajs.co/api/v1/products';
const CATEGORIES_URL = 'https://api.escuelajs.co/api/v1/categories';

export default function SearchRoute() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [price, setPrice] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const response = await fetch(CATEGORIES_URL);

        if (!response.ok) {
          throw new Error('Unable to load categories.');
        }

        const data = (await response.json()) as Category[];

        if (isMounted) {
          setCategories(data);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load categories right now.');
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = setTimeout(async () => {
      setLoadingProducts(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (searchText.trim()) {
          params.set('title', searchText.trim());
        }

        if (price.trim()) {
          params.set('price', price.trim());
        }

        if (priceMin.trim()) {
          params.set('price_min', priceMin.trim());
        }

        if (priceMax.trim()) {
          params.set('price_max', priceMax.trim());
        }

        if (selectedCategoryId !== null) {
          params.set('categoryId', String(selectedCategoryId));
        }

        const url = params.toString() ? `${PRODUCTS_URL}?${params.toString()}` : PRODUCTS_URL;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Unable to search products right now.');
        }

        const data = (await response.json()) as Product[];

        if (isMounted) {
          setProducts(data);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
          setError('Unable to search products right now.');
        }
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [price, priceMax, priceMin, searchText, selectedCategoryId]);

  const resetFilters = () => {
    setSearchText('');
    setPrice('');
    setPriceMin('');
    setPriceMax('');
    setSelectedCategoryId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Filter by title, price, range, and category</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons color="#6D6D6D" name="search-outline" size={18} />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchText}
            placeholder="Search by title"
            placeholderTextColor="#7F7F7F"
            style={styles.searchInput}
            value={searchText}
          />
        </View>

        <View style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Exact Price</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={setPrice}
                placeholder="100"
                placeholderTextColor="#7F7F7F"
                style={styles.filterInput}
                value={price}
              />
            </View>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Min Price</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={setPriceMin}
                placeholder="900"
                placeholderTextColor="#7F7F7F"
                style={styles.filterInput}
                value={priceMin}
              />
            </View>
            <View style={styles.filterField}>
              <Text style={styles.filterLabel}>Max Price</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={setPriceMax}
                placeholder="1000"
                placeholderTextColor="#7F7F7F"
                style={styles.filterInput}
                value={priceMax}
              />
            </View>
          </View>

          <View style={styles.categoryHeader}>
            <Text style={styles.filterLabel}>Categories</Text>
            <Pressable onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              style={[styles.categoryChip, selectedCategoryId === null && styles.categoryChipActive]}>
              <Text style={[styles.categoryText, selectedCategoryId === null && styles.categoryTextActive]}>
                All
              </Text>
            </Pressable>

            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategoryId(category.id)}
                style={[styles.categoryChip, selectedCategoryId === category.id && styles.categoryChipActive]}>
                <Text
                  style={[styles.categoryText, selectedCategoryId === category.id && styles.categoryTextActive]}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {loadingCategories ? <Text style={styles.loadingCategories}>Loading categories...</Text> : null}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Results</Text>
          {!loadingProducts ? <Text style={styles.resultsCount}>{products.length} items</Text> : null}
        </View>

        {loadingProducts ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.stateText}>Searching products...</Text>
          </View>
        ) : null}

        {error && !loadingProducts ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Search unavailable</Text>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        ) : null}

        {!loadingProducts && !error && products.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No products found</Text>
            <Text style={styles.stateText}>Try a different title, price, or category filter.</Text>
          </View>
        ) : null}

        {!loadingProducts && !error && products.length > 0 ? (
          <View style={styles.grid}>
            {products.map((product) => (
              <SearchResultCard
                key={product.id}
                onPress={() => router.push(`/product/${product.id}`)}
                product={product}
              />
            ))}
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#8F8F8F',
    fontSize: 14,
    textAlign: 'center',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#181818',
    borderColor: '#282828',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
  },
  filterPanel: {
    backgroundColor: '#181818',
    borderRadius: 22,
    marginBottom: 18,
    padding: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterField: {
    flex: 1,
  },
  filterLabel: {
    color: '#A6A6A6',
    fontSize: 12,
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#111111',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  categoryList: {
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#111111',
    borderColor: '#2A2A2A',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryChipActive: {
    backgroundColor: '#F3F3F3',
    borderColor: '#F3F3F3',
  },
  categoryText: {
    color: '#D0D0D0',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#111111',
  },
  loadingCategories: {
    color: '#7E7E7E',
    fontSize: 12,
    marginBottom: 16,
  },
  resultsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  resultsCount: {
    color: '#8E8E8E',
    fontSize: 13,
  },
  stateCard: {
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 22,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  stateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  stateText: {
    color: '#9B9B9B',
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
