import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { tokens } from "../../theme/tokens";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: tokens.spacing.xxxl,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: tokens.colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: tokens.colors.primary,
  },
});
