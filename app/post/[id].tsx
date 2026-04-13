import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import { ArrowLeft } from "lucide-react-native";
import { tokens } from "../../theme/tokens";
import {
  PostDetailContent,
  PostDetailActions,
  CommentList,
  CommentInput,
} from "../../components/post-detail";
import { ErrorView } from "../../components/ErrorView";
import {
  usePost,
  useComments,
  useToggleLike,
  useAddComment,
} from "../../services/hooks";
import { wsService } from "../../services/websocket";
import { getAuthToken } from "../../services/auth";
import { useQueryClient } from "@tanstack/react-query";

const PostDetailScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const queryClient = useQueryClient();

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
        console.log("Комментарий добавлен");
      },
    });
  };

  const handleRetry = () => {
    refetchPost();
    refetchComments();
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  if (postLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <ArrowLeft size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (postError || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <ArrowLeft size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <ErrorView
          message="Не удалось загрузить публикацию"
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <ArrowLeft size={24} color={tokens.colors.textPrimary} />
          </TouchableOpacity>
        </View>

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

          {commentsError ? (
            <View style={styles.commentsError}>
              <Text style={styles.commentsErrorText}>
                Не удалось загрузить комментарии
              </Text>
              <TouchableOpacity onPress={() => refetchComments()}>
                <Text style={styles.retryText}>Повторить</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CommentList
              comments={comments}
              loading={commentsLoading}
              loadingMore={isFetchingNextPage}
              hasMore={hasNextPage}
              onLoadMore={fetchNextPage}
            />
          )}
        </View>

        <CommentInput onSubmit={handleSendComment} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
  },
  commentsTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: "600",
    color: tokens.colors.textPrimary,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  commentsError: {
    alignItems: "center",
    paddingVertical: tokens.spacing.xl,
  },
  commentsErrorText: {
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  retryText: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.primary,
  },
});

export default PostDetailScreen;
