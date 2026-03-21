import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { authTheme } from '@/src/utils/auth-theme';

type AuthInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
} & Pick<TextInputProps, 'textContentType' | 'autoComplete'>;

export function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  textContentType,
  autoComplete,
}: AuthInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={false}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={authTheme.placeholder}
        secureTextEntry={secureTextEntry}
        selectionColor={authTheme.textPrimary}
        style={styles.input}
        textContentType={textContentType}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: authTheme.inputBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 28,
  },
  input: {
    color: authTheme.textPrimary,
    fontSize: 16,
    paddingBottom: 14,
    paddingTop: 6,
  },
});
