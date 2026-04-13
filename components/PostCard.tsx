import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { tokens } from "../theme/tokens";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard = observer(({ post, onLike }: PostCardProps) => {
  const isPaid = post.tier === "paid";
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{post.author.displayName}</Text>
            {post.author.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.username}>@{post.author.username}</Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <Text style={styles.title}>{post.title}</Text>

      <View style={styles.coverContainer}>
        <Image
          source={{ uri: post.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        {isPaid ? (
          <View style={styles.paidPlaceholder}>
            <Text style={styles.paidIcon}>🔒</Text>
            <Text style={styles.paidText}>Платный контент</Text>
            <Text style={styles.paidSubtext}>
              Подпишитесь, чтобы увидеть публикацию
            </Text>
          </View>
        ) : (
          <Text style={styles.preview} numberOfLines={3}>
            {post.preview}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLike}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? "❤️" : "🤍"}
          </Text>
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.borderRadius.lg,
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    padding: tokens.spacing.lg,
    ...tokens.shadows.sm,
  },
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
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  coverContainer: {
    marginBottom: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    overflow: "hidden",
    backgroundColor: tokens.colors.surface,
  },
  cover: {
    width: "100%",
    height: 180,
  },
  content: {
    marginBottom: tokens.spacing.lg,
  },
  preview: {
    fontSize: tokens.typography.fontSize.md,
    lineHeight:
      tokens.typography.lineHeight.normal * tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
  },
  paidPlaceholder: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.xl,
    alignItems: "center",
  },
  paidIcon: {
    fontSize: 32,
    marginBottom: tokens.spacing.sm,
  },
  paidText: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  paidSubtext: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    textAlign: "center",
  },
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
