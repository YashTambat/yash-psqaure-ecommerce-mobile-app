import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

function StepDots({ activeStep }: { activeStep: 1 | 2 }) {
  return (
    <View style={styles.stepper}>
      <View style={[styles.stepIcon, activeStep === 1 && styles.stepIconActive]}>
        <Ionicons color={activeStep === 1 ? '#111111' : '#9EA3B1'} name="location-sharp" size={22} />
      </View>
      <View style={styles.stepDotsWrap}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`left-${index}`} style={styles.stepDot} />
        ))}
      </View>
      <View style={styles.stepIconCenter}>
        <Ionicons color="#9EA3B1" name="card" size={18} />
      </View>
      <View style={styles.stepDotsWrap}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={`right-${index}`} style={styles.stepDot} />
        ))}
      </View>
      <View style={styles.stepIcon}>
        <Ionicons color="#9EA3B1" name="checkmark" size={20} />
      </View>
    </View>
  );
}

export default function CheckoutShippingRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [copyFromShipping, setCopyFromShipping] = useState(false);

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
        <StepDots activeStep={1} />

        <Text style={styles.stepLabel}>STEP 1</Text>
        <Text style={styles.sectionTitle}>Shipping</Text>

        <View style={styles.form}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>First name *</Text>
            <TextInput defaultValue="Pham" placeholder="First name" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Last name *</Text>
            <TextInput placeholder="Last name" placeholderTextColor="#6F6F6F" style={styles.input} />
            <Text style={styles.errorText}>Field required</Text>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Country *</Text>
            <View style={styles.selectField}>
              <Text style={styles.selectText}>Select country</Text>
              <Ionicons color="#FFFFFF" name="chevron-down" size={16} />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Street name *</Text>
            <TextInput placeholder="Street name" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>City *</Text>
            <TextInput placeholder="City" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>State / Province</Text>
            <TextInput placeholder="State / Province" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Zip-code *</Text>
            <TextInput keyboardType="number-pad" placeholder="Zip-code" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Phone number *</Text>
            <TextInput keyboardType="phone-pad" placeholder="Phone number" placeholderTextColor="#6F6F6F" style={styles.input} />
          </View>
        </View>

        <Text style={styles.blockTitle}>Shipping method</Text>

        <Pressable style={[styles.shippingCard, styles.shippingCardActive]}>
          <View style={styles.radioActiveOuter}>
            <View style={styles.radioActiveInner} />
          </View>
          <View style={styles.shippingCopy}>
            <View style={styles.shippingRow}>
              <Text style={styles.shippingName}>Free</Text>
              <Text style={styles.shippingMeta}>Delivery to home</Text>
            </View>
            <Text style={styles.shippingTime}>Delivery from 3 to 7 business days</Text>
          </View>
        </Pressable>

        <Pressable style={styles.shippingCard}>
          <View style={styles.radioOuter} />
          <View style={styles.shippingCopy}>
            <View style={styles.shippingRow}>
              <Text style={styles.shippingName}>$ 9.90</Text>
              <Text style={styles.shippingMeta}>Delivery to home</Text>
            </View>
            <Text style={styles.shippingTime}>Delivery from 4 to 6 business days</Text>
          </View>
        </Pressable>

        <Pressable style={styles.shippingCard}>
          <View style={styles.radioOuter} />
          <View style={styles.shippingCopy}>
            <View style={styles.shippingRow}>
              <Text style={styles.shippingName}>$ 9.90</Text>
              <Text style={styles.shippingMeta}>Fast Delivery</Text>
            </View>
            <Text style={styles.shippingTime}>Delivery from 2 to 3 business days</Text>
          </View>
        </Pressable>

        <Text style={styles.blockTitle}>Coupon Code</Text>
        <View style={styles.couponBox}>
          <Text style={styles.couponPlaceholder}>Have a code? type it here...</Text>
          <Pressable>
            <Text style={styles.validateText}>Validate</Text>
          </Pressable>
        </View>

        <Text style={styles.blockTitle}>Billing Address</Text>
        <Pressable onPress={() => setCopyFromShipping((value) => !value)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, copyFromShipping && styles.checkboxActive]}>
            {copyFromShipping ? <Ionicons color="#111111" name="checkmark" size={12} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>Copy address data from shipping</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.bottomWrap, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          onPress={() => router.push('/checkout/payment')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
          <Text style={styles.primaryButtonText}>Continue to payment</Text>
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
  stepIconActive: {
    backgroundColor: '#FFFFFF',
  },
  stepIconCenter: {
    alignItems: 'center',
    backgroundColor: '#8D93A3',
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
  form: {
    marginBottom: 18,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#D3D3D3',
    fontSize: 12,
    marginBottom: 10,
  },
  input: {
    borderBottomColor: '#4A4A4A',
    borderBottomWidth: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingBottom: 12,
  },
  errorText: {
    color: '#C14242',
    fontSize: 10,
    marginTop: 6,
  },
  selectField: {
    alignItems: 'center',
    borderBottomColor: '#4A4A4A',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  selectText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  blockTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 10,
  },
  shippingCard: {
    alignItems: 'flex-start',
    borderColor: '#3A3A3A',
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  shippingCardActive: {
    backgroundColor: '#232733',
    borderColor: '#232733',
  },
  radioOuter: {
    borderColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    marginRight: 12,
    marginTop: 3,
    width: 16,
  },
  radioActiveOuter: {
    alignItems: 'center',
    backgroundColor: '#4BC7B1',
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 3,
    width: 16,
  },
  radioActiveInner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  shippingCopy: {
    flex: 1,
  },
  shippingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  shippingName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  shippingMeta: {
    color: '#D5D5D5',
    fontSize: 12,
  },
  shippingTime: {
    color: '#9B9B9B',
    fontSize: 11,
  },
  couponBox: {
    alignItems: 'center',
    backgroundColor: '#2B2F3B',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  couponPlaceholder: {
    color: '#B1B1B1',
    fontSize: 12,
  },
  validateText: {
    color: '#72C7B1',
    fontSize: 12,
  },
  checkboxRow: {
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
  checkboxLabel: {
    color: '#CFCFCF',
    fontSize: 12,
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
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
});
