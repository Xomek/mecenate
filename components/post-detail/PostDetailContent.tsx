import React from "react";
import { Text, StyleSheet } from "react-native";
import { PostHeader } from "../post/PostHeader";
import { PostCover } from "../post/PostCover";
import { tokens } from "../../theme/tokens";
import type { Post } from "../../types";

interface PostDetailContentProps {
  post: Post;
}

export const PostDetailContent = ({ post }: PostDetailContentProps) => {
  return (
    <>
      <PostHeader author={post.author} createdAt={post.createdAt} />
      <Text style={styles.title}>{post.title}</Text>
      <PostCover coverUrl={post.coverUrl} />
      <Text style={styles.body}>{post.body}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: tokens.typography.fontSize.xxl,
    fontWeight: "bold",
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.md,
  },
  body: {
    fontSize: tokens.typography.fontSize.md,
    lineHeight:
      tokens.typography.lineHeight.normal * tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
    marginVertical: tokens.spacing.lg,
  },
});
