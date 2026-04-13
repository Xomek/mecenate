import React from "react";
import { FlatList, Text, ActivityIndicator, StyleSheet } from "react-native";
import { CommentItem } from "./CommentItem";
import { tokens } from "../../theme/tokens";
import type { Comment } from "../../types";

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const CommentList = ({
  comments,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: CommentListProps) => {
  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        size="large"
        color={tokens.colors.primary}
      />
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CommentItem comment={item} />}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={<Text style={styles.empty}>Нет комментариев</Text>}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator
            style={styles.loadingMore}
            color={tokens.colors.primary}
          />
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMore: {
    paddingVertical: tokens.spacing.lg,
  },
  empty: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textTertiary,
    textAlign: "center",
    paddingVertical: tokens.spacing.xl,
  },
});
