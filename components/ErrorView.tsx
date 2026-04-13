import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { tokens } from "../theme/tokens";

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacing.xxxl,
  },
  icon: {
    fontSize: 48,
    marginBottom: tokens.spacing.lg,
  },
  message: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textSecondary,
    textAlign: "center",
    marginBottom: tokens.spacing.xl,
  },
  button: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
  },
  buttonText: {
    color: tokens.colors.background,
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
  },
});
