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
    return null;
  }

  const displayText = expanded && body ? body : preview;
  const hasMore = body && body.length > preview.length;

  return (
    <View style={styles.content}>
      <Text style={styles.preview}>
        {displayText}
        {hasMore && !expanded && (
          <Text>
            <Text style={styles.showMore} onPress={() => setExpanded(true)}>
              Показать ещё
            </Text>
          </Text>
        )}
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
  showMore: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.primary,
  },
});
