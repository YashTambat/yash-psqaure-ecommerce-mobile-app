import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useCart } from '@/components/cart/cart-context';

const formatOrderDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export default function AccountRoute() {
  const router = useRouter();
  const { clearAuthSession, orders, profile, token } = useCart();
  const avatarLetter = profile.name.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    await clearAuthSession();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageEyebrow}>Profile</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Account</Text>
          {token ? (
            <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]} onPress={handleLogout}>
              <Ionicons color="#FFFFFF" name="log-out-outline" size={16} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <View style={styles.profileMeta}>
            <Text style={styles.profileLabel}>Signed in as</Text>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <Text style={styles.sectionMeta}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons color="#A1A7B8" name="receipt-outline" size={24} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Complete a checkout and your recent orders will appear here.</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{formatOrderDate(order.placedAt)}</Text>
                </View>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>Delivered</Text>
                </View>
              </View>

              <View style={styles.orderStats}>
                <View style={styles.orderStatBlock}>
                  <Text style={styles.orderStatLabel}>Items</Text>
                  <Text style={styles.orderStatValue}>{order.itemCount}</Text>
                </View>
                <View style={styles.orderStatBlock}>
                  <Text style={styles.orderStatLabel}>Total</Text>
                  <Text style={styles.orderStatValue}>${order.total.toFixed(2)}</Text>
                </View>
              </View>

              <Text numberOfLines={2} style={styles.orderItemsPreview}>
                {order.items.map((item) => `${item.title} x${item.quantity}`).join(', ')}
              </Text>
            </View>
          ))
        )}
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
  pageEyebrow: {
    color: '#7E8596',
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#232833',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#1A1E28',
    borderColor: '#2A303D',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 28,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 999,
    height: 62,
    justifyContent: 'center',
    marginRight: 16,
    width: 62,
  },
  avatarText: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
  },
  profileLabel: {
    color: '#8D93A3',
    fontSize: 12,
    marginBottom: 6,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#BDC3D3',
    fontSize: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionMeta: {
    color: '#8D93A3',
    fontSize: 13,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#181818',
    borderColor: '#252525',
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 14,
  },
  emptyText: {
    color: '#9EA3B1',
    lineHeight: 22,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#171A21',
    borderColor: '#262C38',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  orderTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderId: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderDate: {
    color: '#9EA3B1',
    fontSize: 13,
  },
  orderBadge: {
    backgroundColor: '#86D0B5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  orderBadgeText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
  orderStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  orderStatBlock: {
    backgroundColor: '#111111',
    borderRadius: 16,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  orderStatLabel: {
    color: '#8D93A3',
    fontSize: 12,
    marginBottom: 6,
  },
  orderStatValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  orderItemsPreview: {
    color: '#C6CBD8',
    fontSize: 13,
    lineHeight: 20,
  },
});
