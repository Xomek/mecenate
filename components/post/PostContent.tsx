import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";

interface PostContentProps {
  preview: string;
  isPaid: boolean;
  body?: string;
}

export const PostContent = ({ preview, isPaid, body }: PostContentProps) => {
  const [expanded, setExpanded] = useState(false);

  if (isPaid) {
    return (
      <View style={styles.content}>
        <View style={[styles.skeletonLine, styles.skeletonShort]} />
        <View style={styles.skeletonLine} />
      </View>
    );
  }

  const hasMore = body && body.length > preview.length;
  const displayText = expanded && body ? body : preview;

  return (
    <View style={styles.content}>
      <Text style={styles.preview} numberOfLines={expanded ? undefined : 3}>
        {displayText}
      </Text>
      {hasMore && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.showMore}>Показать ещё</Text>
        </TouchableOpacity>
      )}
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
  showMore: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.primary,
    marginTop: tokens.spacing.xs,
  },
  skeletonLine: {
    height: 40,
    backgroundColor: tokens.colors.skeleton,
    borderRadius: 22,
    marginBottom: 8,
    width: "100%",
  },
  skeletonShort: {
    height: 26,
    width: "50%",
  },
  skeletonMedium: {
    width: "85%",
  },
});
