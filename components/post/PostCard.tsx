import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { tokens } from "../../theme/tokens";
import { PostHeader } from "./PostHeader";
import { PostCover } from "./PostCover";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { PaidOverlay } from "./PaidOverlay";
import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
  onLike: () => void;
  body?: string;
}

export const PostCard = observer(({ post, onLike, body }: PostCardProps) => {
  const isPaid = post.tier === "paid";

  return (
    <View style={styles.card}>
      <PostHeader author={post.author} createdAt={post.createdAt} />

      <Text style={styles.title}>{post.title}</Text>

      <PostCover coverUrl={post.coverUrl} title={post.title} />

      <PostContent preview={post.preview} isPaid={isPaid} body={body} />

      <PostActions
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        onLike={onLike}
      />

      {isPaid && <PaidOverlay />}
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
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
});
