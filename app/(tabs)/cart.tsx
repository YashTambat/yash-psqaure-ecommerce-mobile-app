import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useCart } from '@/components/cart/cart-context';

export default function CartRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#FFFFFF" name="chevron-back" size={18} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 230 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Add a product from the details screen to see it here.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.cartKey} style={styles.cartCard}>
              <Image contentFit="cover" source={{ uri: item.image }} style={styles.productImage} />

              <View style={styles.itemBody}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemTextWrap}>
                    <Text numberOfLines={2} style={styles.productTitle}>
                      {item.title}
                    </Text>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={styles.checkBadge}>
                      <Ionicons color="#111111" name="checkmark" size={14} />
                    </View>
                    <Pressable
                      onPress={() => removeItem(item.cartKey)}
                      style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}>
                      <Ionicons color="#FFFFFF" name="trash-outline" size={15} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.itemBottomRow}>
                  <Text style={styles.variantMeta}>
                    Size: {item.size} | Color: {item.color === '#F1D7C6' ? 'Cream' : item.color === '#1D1D1F' ? 'Black' : 'Rose'}
                  </Text>

                  <View style={styles.quantityRow}>
                    <Pressable onPress={() => decreaseQuantity(item.cartKey)} style={styles.quantityButton}>
                      <Ionicons color="#FFFFFF" name="remove" size={14} />
                    </Pressable>
                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                    <Pressable onPress={() => increaseQuantity(item.cartKey)} style={styles.quantityButton}>
                      <Ionicons color="#FFFFFF" name="add" size={14} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={[styles.summaryCard, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Product price</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(0)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>{items.length > 0 ? 'Freeship' : '$0'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${total.toFixed(0)}</Text>
        </View>

        <Pressable
          onPress={() => router.push('/checkout/shipping')}
          style={({ pressed }) => [styles.checkoutButton, pressed && styles.checkoutButtonPressed]}>
          <Text style={styles.checkoutText}>Proceed to checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#20242F',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  backButton: {
    alignItems: 'center',
    borderColor: '#343434',
    borderRadius: 18,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 34,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 120,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyText: {
    color: '#B3B6C1',
    lineHeight: 22,
    textAlign: 'center',
  },
  cartCard: {
    backgroundColor: '#121316',
    borderColor: '#2B2E37',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 12,
  },
  productImage: {
    borderRadius: 14,
    height: 92,
    marginRight: 12,
    width: 72,
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  itemTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  checkBadge: {
    alignItems: 'center',
    backgroundColor: '#86D0B5',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  variantMeta: {
    color: '#9AA0AC',
    fontSize: 12,
    flex: 1,
    paddingRight: 10,
  },
  itemBottomRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityRow: {
    alignItems: 'center',
    backgroundColor: '#0D0E12',
    borderRadius: 999,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  quantityButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  quantityValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 22,
    textAlign: 'center',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#20242F',
    borderRadius: 12,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  deleteButtonPressed: {
    opacity: 0.82,
  },
  summaryCard: {
    backgroundColor: '#121316',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    bottom: 0,
    left: 0,
    paddingHorizontal: 18,
    paddingTop: 20,
    position: 'absolute',
    right: 0,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  summaryLabel: {
    color: '#E5E5E5',
    fontSize: 16,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#262932',
    height: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 999,
    marginTop: 18,
    paddingVertical: 18,
  },
  checkoutButtonPressed: {
    opacity: 0.85,
  },
  checkoutText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
  },
});
