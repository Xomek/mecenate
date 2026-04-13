import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { tokens } from "../theme/tokens";

export const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
    </View>
  );
};

export const LoadingMoreIndicator = () => {
  return (
    <View style={styles.loadingMore}>
      <ActivityIndicator size="small" color={tokens.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMore: {
    paddingVertical: tokens.spacing.lg,
    alignItems: "center",
  },
});
