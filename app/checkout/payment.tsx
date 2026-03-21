import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useCart } from '@/components/cart/cart-context';

function StepDots() {
  return (
    <View style={styles.stepper}>
      <View style={styles.stepIcon}>
        <Ionicons color="#9EA3B1" name="location-sharp" size={22} />
      </View>
      <View style={styles.stepDotsWrap}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`left-${index}`} style={styles.stepDot} />
        ))}
      </View>
      <View style={styles.stepIconCenterActive}>
        <Ionicons color="#111111" name="card" size={18} />
      </View>
      <View style={styles.stepDotsWrap}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`right-${index}`} style={styles.stepDot} />
        ))}
      </View>
      <View style={styles.stepIcon}>
        <Ionicons color="#111111" name="checkmark" size={20} />
      </View>
    </View>
  );
}

export default function CheckoutPaymentRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, placeOrder } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    const order = placeOrder();

    if (order) {
      router.replace('/(tabs)/account');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#FFFFFF" name="chevron-back" size={18} />
        </Pressable>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <StepDots />

        <Text style={styles.stepLabel}>STEP 2</Text>
        <Text style={styles.sectionTitle}>Payment</Text>

        <View style={styles.methodRow}>
          <Pressable style={[styles.methodCard, styles.methodCardActive]}>
            <Ionicons color="#FFFFFF" name="cash-outline" size={18} />
            <Text style={styles.methodText}>Cash</Text>
          </Pressable>
          <Pressable style={styles.methodCard}>
            <Ionicons color="#FFFFFF" name="card-outline" size={18} />
            <Text style={styles.methodText}>Credit Card</Text>
          </Pressable>
          <Pressable style={styles.methodCard}>
            <Ionicons color="#FFFFFF" name="ellipsis-horizontal" size={18} />
            <Text style={styles.methodText}>...</Text>
          </Pressable>
        </View>

        <View style={styles.cardHeader}>
          <Text style={styles.blockTitle}>Choose your card</Text>
          <Pressable>
            <Text style={styles.addNewText}>Add new +</Text>
          </Pressable>
        </View>

        <Text style={styles.subLabel}>or check out with</Text>

        <View style={styles.brandRow}>
          {['PayPal', 'VISA', 'MasterCard', 'Alipay', 'AMEX'].map((brand) => (
            <View key={brand} style={styles.brandChip}>
              <Text style={styles.brandText}>{brand}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Product price</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(0)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Freeship</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(0)}</Text>
          </View>
        </View>

        <Pressable onPress={() => setAcceptedTerms((value) => !value)} style={styles.termsRow}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
            {acceptedTerms ? <Ionicons color="#111111" name="checkmark" size={12} /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to <Text style={styles.termsLink}>Terms and conditions</Text>
          </Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.bottomWrap, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          onPress={handlePlaceOrder}
          style={({ pressed }) => [
            styles.primaryButton,
            (!acceptedTerms || items.length === 0) && styles.primaryButtonDisabled,
            pressed && acceptedTerms && items.length > 0 && styles.primaryButtonPressed,
          ]}
          disabled={!acceptedTerms || items.length === 0}>
          <Text style={styles.primaryButtonText}>Place my order</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#111111',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 8,
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
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 34,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
  },
  stepIcon: {
    alignItems: 'center',
    backgroundColor: '#8D93A3',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  stepIconCenterActive: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginHorizontal: 12,
    width: 48,
  },
  stepDotsWrap: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 12,
  },
  stepDot: {
    backgroundColor: '#8D93A3',
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  stepLabel: {
    color: '#6E6E6E',
    fontSize: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 20,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  methodCard: {
    alignItems: 'center',
    backgroundColor: '#242833',
    borderColor: '#313540',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  methodCardActive: {
    borderColor: '#FFFFFF',
  },
  methodText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 6,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  blockTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  addNewText: {
    color: '#D85252',
    fontSize: 12,
  },
  subLabel: {
    color: '#B5B5B5',
    fontSize: 11,
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  brandChip: {
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    borderColor: '#333333',
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#151515',
    borderColor: '#262626',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  summaryLabel: {
    color: '#E5E5E5',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#262626',
    height: StyleSheet.hairlineWidth,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    borderColor: '#8C8C8C',
    borderRadius: 2,
    borderWidth: 1,
    height: 14,
    marginRight: 10,
    width: 14,
  },
  checkboxActive: {
    alignItems: 'center',
    backgroundColor: '#72C7B1',
    borderColor: '#72C7B1',
    justifyContent: 'center',
  },
  termsText: {
    color: '#BDBDBD',
    fontSize: 12,
  },
  termsLink: {
    color: '#BDBDBD',
    textDecorationLine: 'underline',
  },
  bottomWrap: {
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 999,
    justifyContent: 'center',
    paddingVertical: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
});
