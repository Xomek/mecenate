import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { DollarSign } from "lucide-react-native";
import { tokens } from "../../theme/tokens";

interface PaidCoverOverlayProps {
  onDonate?: () => void;
}

export const PaidCoverOverlay = ({ onDonate }: PaidCoverOverlayProps) => {
  const handleDonate = () => {
    console.log("Donate pressed");
    onDonate?.();
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={40} tint="dark" style={styles.blur} />
      <View style={styles.darkOverlay} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <DollarSign style={styles.iconDollars} size={20} />
        </View>
        <Text style={styles.title}>Контент скрыт пользователем.</Text>
        <Text style={styles.subtitle}>Доступ откроется после доната</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDonate}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Отправить донат</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: tokens.borderRadius.md,
    overflow: "hidden",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacing.xl,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: tokens.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.spacing.md,
  },
  iconDollars: {
    backgroundColor: "#FFFFFF",
    color: tokens.colors.primary,
    borderRadius: "50%",
    padding: 2,
  },
  title: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: tokens.spacing.lg,
    textAlign: "center",
  },
  button: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
    padding: 2,
  },
});
