import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";
import type { Author } from "../../types";

interface PostHeaderProps {
  author: Author;
  createdAt: string;
}

export const PostHeader = ({ author, createdAt }: PostHeaderProps) => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      <View style={styles.authorInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{author.displayName}</Text>
        </View>
      </View>
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
});
