import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { authTheme } from '@/src/utils/auth-theme';

type AuthScreenLayoutProps = {
  titleLines: [string, string];
  fields: ReactNode;
  ctaLabel: string;
  onCtaPress: () => void;
  footerText: string;
  footerLinkLabel: string;
  onFooterLinkPress: () => void;
  helperText?: string;
};

export function AuthScreenLayout({
  titleLines,
  fields,
  ctaLabel,
  onCtaPress,
  footerText,
  footerLinkLabel,
  onFooterLinkPress,
  helperText,
}: AuthScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{titleLines[0]}</Text>
            <Text style={styles.title}>{titleLines[1]}</Text>
          </View>

          <View style={styles.formBlock}>{fields}</View>

          {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}

          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onCtaPress}>
            <Text style={styles.buttonText}>{ctaLabel}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText}</Text>
          <Pressable onPress={onFooterLinkPress}>
            <Text style={styles.footerLink}>{footerLinkLabel}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authTheme.background,
  },
  container: {
    backgroundColor: authTheme.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 36,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  titleBlock: {
    gap: 12,
  },
  title: {
    color: authTheme.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  formBlock: {
    marginTop: 68,
  },
  helperText: {
    alignSelf: 'flex-end',
    color: '#4A4A4A',
    fontSize: 12,
    marginTop: -10,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: authTheme.buttonBackground,
    borderRadius: 999,
    marginTop: 40,
    minWidth: 160,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: authTheme.buttonText,
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  footerText: {
    color: authTheme.textPrimary,
    fontSize: 16,
  },
  footerLink: {
    color: authTheme.link,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
