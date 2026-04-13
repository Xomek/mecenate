import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { tokens } from "../theme/tokens";

import errorIllustration from "../assets/images/illustration_sticker.png";

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorView = ({
  message = "Не удалось загрузить публикации",
  onRetry,
}: ErrorViewProps) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={errorIllustration}
        resizeMode="contain"
      />
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
    paddingHorizontal: tokens.spacing.xxxl,
  },
  icon: {
    width: 120,
    height: 120,
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
    paddingHorizontal: tokens.spacing.xxxl,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.full,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
  },
});
