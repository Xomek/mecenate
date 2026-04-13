import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { tokens } from "../../theme/tokens";

interface PaidOverlayProps {
  onDonate?: () => void;
}

export const PaidOverlay = ({ onDonate }: PaidOverlayProps) => {
  const handleDonate = () => {
    console.log("Donate pressed");
    onDonate?.();
  };

  return (
    <View style={styles.paidOverlay}>
      <BlurView intensity={20} tint="dark" style={styles.blur} />
      <View style={styles.paidContent}>
        <Text style={styles.paidTitle}>Контент скрыт пользователем.</Text>
        <Text style={styles.paidSubtitle}>Доступ откроется после доната</Text>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={handleDonate}
          activeOpacity={0.8}
        >
          <Text style={styles.donateButtonText}>Отправить донат</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paidOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: tokens.borderRadius.lg,
    overflow: "hidden",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paidContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  paidTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: tokens.spacing.xs,
    textAlign: "center",
  },
  paidSubtitle: {
    fontSize: tokens.typography.fontSize.md,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: tokens.spacing.xl,
    textAlign: "center",
  },
  donateButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.xxxl,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.full,
    minWidth: 200,
    alignItems: "center",
  },
  donateButtonText: {
    color: "#FFFFFF",
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
  },
});
