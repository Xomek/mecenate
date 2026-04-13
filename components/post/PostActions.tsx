import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export const PostActions = ({
  likesCount,
  commentsCount,
  isLiked,
  onLike,
}: PostActionsProps) => {
  return (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
          {isLiked ? "❤️" : "🤍"}
        </Text>
        <Text style={[styles.actionText, isLiked && styles.likedText]}>
          {likesCount}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionButton}>
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>{commentsCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: tokens.colors.separator,
    paddingTop: tokens.spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: tokens.spacing.xs,
  },
  likedIcon: {},
  actionText: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textSecondary,
  },
  likedText: {
    color: tokens.colors.secondary,
  },
});
