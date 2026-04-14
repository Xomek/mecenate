import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";
import { tokens } from "../../theme/tokens";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export const TextField = ({
  label,
  error,
  multiline,
  style,
  ...props
}: TextFieldProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={tokens.colors.textTertiary}
        multiline={multiline}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: "500",
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xs,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  multiline: {
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: tokens.colors.error,
  },
  error: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
});
