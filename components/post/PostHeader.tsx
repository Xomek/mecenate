import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";
import type { Author } from "../../types";

interface PostHeaderProps {
  author: Author;
  createdAt: string;
}

export const PostHeader = ({ author, createdAt }: PostHeaderProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.header}>
      <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      <View style={styles.authorInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{author.displayName}</Text>
          {author.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>@{author.username}</Text>
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: tokens.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: tokens.spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: tokens.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.spacing.xs,
  },
  verifiedText: {
    color: tokens.colors.background,
    fontSize: 10,
    fontWeight: "bold",
  },
  username: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textTertiary,
  },
});
