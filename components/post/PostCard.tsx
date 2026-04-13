import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { tokens } from "../../theme/tokens";
import { PostHeader } from "./PostHeader";
import { PostCover } from "./PostCover";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { PaidCoverOverlay } from "./PaidCoverOverlay";
import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard = observer(({ post, onLike }: PostCardProps) => {
  const isPaid = post.tier === "paid";

  return (
    <View style={styles.card}>
      <PostHeader author={post.author} createdAt={post.createdAt} />

      <View style={styles.coverContainer}>
        <PostCover coverUrl={post.coverUrl} title={post.title} />
        {isPaid && <PaidCoverOverlay />}
      </View>

      {!isPaid && <Text style={styles.title}>{post.title}</Text>}

      <PostContent preview={post.preview} isPaid={isPaid} body={post.body} />

      {!isPaid && (
        <PostActions
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={post.isLiked}
          onLike={onLike}
        />
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
    boxShadow: tokens.shadows.sm.boxShadow,
    elevation: tokens.shadows.sm.elevation,
  },
  coverContainer: {
    position: "relative",
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
});
