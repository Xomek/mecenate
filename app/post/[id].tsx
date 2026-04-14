import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokens } from "../../theme/tokens";
import {
  PostDetailContent,
  PostDetailActions,
  CommentItem,
  CommentInput,
} from "../../components/post-detail";
import {
  usePost,
  useComments,
  useToggleLike,
  useAddComment,
} from "../../services/hooks";
import { wsService } from "../../services/websocket";
import { getAuthToken } from "../../services/auth";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorView } from "../../components/error/ErrorView";

const PostDetailScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
    refetch: refetchPost,
  } = usePost(id);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useComments(id);

  const { mutate: toggleLike } = useToggleLike();
  const { mutate: addComment } = useAddComment(id);

  const post = postData?.data.post;
  const comments =
    commentsData?.pages.flatMap((page) => page.data.comments) ?? [];

  useEffect(() => {
    const initWebSocket = async () => {
      const token = await getAuthToken();
      wsService.connect(token);
    };
    initWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = wsService.subscribe((event) => {
      if (event.type === "like_updated" && event.postId === id) {
        refetchPost();
      }
      if (event.type === "comment_added" && event.comment?.postId === id) {
        refetchPost();
        refetchComments();
      }
    });

    return unsubscribe;
  }, [id, refetchPost, refetchComments]);

  const handleLike = () => {
    if (!post) return;

    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
    };

    queryClient.setQueryData(["post", id], {
      ...postData,
      data: { post: updatedPost },
    });

    toggleLike(post.id);
  };

  const handleSendComment = (text: string) => {
    addComment(text, {
      onSuccess: () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      },
    });
  };

  const handleRetry = () => {
    refetchPost();
    refetchComments();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (postLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={tokens.colors.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </View>
    );
  }

  if (postError || !post) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={tokens.colors.background}
        />
        <ErrorView
          message="Не удалось загрузить публикацию"
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={tokens.colors.background}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItemContainer}>
              <CommentItem comment={item} />
            </View>
          )}
          ListHeaderComponent={
            <View style={styles.content}>
              <PostDetailContent post={post} />

              <PostDetailActions
                likesCount={post.likesCount}
                commentsCount={comments.length}
                isLiked={post.isLiked}
                onLike={handleLike}
              />

              <Text style={styles.commentsTitle}>
                Комментарии ({comments.length})
              </Text>
            </View>
          }
          ListEmptyComponent={
            !commentsLoading && !commentsError ? (
              <Text style={styles.empty}>Нет комментариев</Text>
            ) : null
          }
          ListFooterComponent={
            <>
              {commentsError && (
                <View style={styles.commentsError}>
                  <Text style={styles.commentsErrorText}>
                    Не удалось загрузить комментарии
                  </Text>
                  <TouchableOpacity onPress={() => refetchComments()}>
                    <Text style={styles.retryText}>Повторить</Text>
                  </TouchableOpacity>
                </View>
              )}
              {isFetchingNextPage && (
                <ActivityIndicator
                  style={styles.loadingMore}
                  color={tokens.colors.primary}
                />
              )}
            </>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={[
            styles.listContent,
            comments.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          style={{ flex: 1 }}
        />

        <CommentInput onSubmit={handleSendComment} />
      </KeyboardAvoidingView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.md,
  },
  commentItemContainer: {
    paddingHorizontal: tokens.spacing.lg,
  },
  commentsTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  empty: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textTertiary,
    textAlign: "center",
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  loadingMore: {
    paddingVertical: tokens.spacing.lg,
  },
  commentsError: {
    alignItems: "center",
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
  },
  commentsErrorText: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
    textAlign: "center",
  },
  retryText: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.primary,
  },
});

export default PostDetailScreen;
