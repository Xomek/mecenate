import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "../shared/Avatar";
import { tokens } from "../../theme/tokens";
import type { Author } from "../../types";

interface PostHeaderProps {
  author: Author;
}

export const PostHeader = ({ author }: PostHeaderProps) => {
  return (
    <View style={styles.header}>
      <Avatar
        source={{ uri: author.avatarUrl }}
        size={40}
        fallback={author.displayName}
      />
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
  authorInfo: {
    flex: 1,
    marginLeft: tokens.spacing.md,
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
