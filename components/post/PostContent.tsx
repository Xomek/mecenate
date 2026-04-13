import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";

interface PostContentProps {
  preview: string;
  isPaid: boolean;
}

export const PostContent = ({ preview, isPaid }: PostContentProps) => {
  if (isPaid) {
    return null;
  }

  return (
    <View style={styles.content}>
      <Text style={styles.preview} numberOfLines={3}>
        {preview}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginBottom: tokens.spacing.lg,
  },
  preview: {
    fontSize: tokens.typography.fontSize.md,
    lineHeight:
      tokens.typography.lineHeight.normal * tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
  },
});
