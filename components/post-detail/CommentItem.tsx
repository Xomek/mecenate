import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PostHeader } from "../post/PostHeader";
import { tokens } from "../../theme/tokens";
import type { Comment } from "../../types";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <View style={styles.container}>
      <PostHeader author={comment.author} createdAt={comment.createdAt} />
      <Text style={styles.text}>{comment.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.lg,
  },
  text: {
    fontSize: tokens.typography.fontSize.md,
    lineHeight:
      tokens.typography.lineHeight.normal * tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
    marginLeft: 56,
  },
});
