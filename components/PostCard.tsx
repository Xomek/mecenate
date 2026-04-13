import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
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
        <Image source={{ uri: post.coverUrl }} style={styles.cover} />
      </View>

      {!isPaid && (
        <View style={styles.content}>
          <Text style={styles.preview} numberOfLines={3}>
            {post.preview}
          </Text>
        </View>
      )}

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

      {isPaid && (
        <View style={styles.paidOverlay}>
          <BlurView intensity={20} tint="dark" style={styles.blur} />
          <View style={styles.paidContent}>
            <Text style={styles.paidTitle}>Контент скрыт пользователем.</Text>
            <Text style={styles.paidSubtitle}>
              Доступ откроется после доната
            </Text>
            <TouchableOpacity style={styles.donateButton} activeOpacity={0.8}>
              <Text style={styles.donateButtonText}>Отправить донат</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    position: "relative",
    overflow: "hidden",
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
  // Стили для оверлея платного контента
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
