import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Heart } from "lucide-react-native";
import { tokens } from "../../theme/tokens";
import type { Comment } from "../../types";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => prev + (isLiked ? -1 : 1));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.author.avatarUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.authorName}>{comment.author.displayName}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={handleLike}
        activeOpacity={0.7}
      >
        <Heart
          size={16}
          color={isLiked ? tokens.colors.like : tokens.colors.icon}
          fill={isLiked ? tokens.colors.like : "none"}
        />
        {likesCount > 0 && (
          <Text style={[styles.likesCount, isLiked && styles.likesCountLiked]}>
            {likesCount}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: tokens.spacing.sm,
  },
  content: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  authorName: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: tokens.typography.fontSize.md,
    lineHeight:
      tokens.typography.lineHeight.normal * tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },
  likesCount: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginLeft: 4,
  },
  likesCountLiked: {
    color: tokens.colors.like,
  },
});
