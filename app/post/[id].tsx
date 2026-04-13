import React, { useEffect, useState, useCallback } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { ArrowLeft } from "lucide-react-native";
import { tokens } from "../../theme/tokens";
import {
  PostDetailContent,
  PostDetailActions,
  CommentList,
  CommentInput,
} from "../../components/post-detail";
import { api } from "../../services/api";
import { wsService } from "../../services/websocket";
import { getAuthToken } from "../../services/auth";
import type { Post, Comment } from "../../types";

const PostDetailScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);

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
      if (event.type === "like_updated" && event.data.postId === id) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likesCount: event.data.likesCount,
                isLiked: event.data.isLiked,
              }
            : prev,
        );
      }
      if (event.type === "comment_added" && event.data.postId === id) {
        setComments((prev) => [event.data.comment, ...prev]);
      }
    });

    return unsubscribe;
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `https://k8s.mectest.ru/test-app/posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      if (data.ok) setPost(data.data.post);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (cursor?: string) => {
    if (!id) return;

    if (!cursor) {
      setLoadingComments(true);
    } else {
      setLoadingMoreComments(true);
    }

    try {
      const token = await getAuthToken();
      const url = new URL(
        `https://k8s.mectest.ru/test-app/posts/${id}/comments`,
      );
      url.searchParams.append("limit", "20");
      if (cursor) url.searchParams.append("cursor", cursor);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.ok) {
        if (cursor) {
          setComments((prev) => [...prev, ...data.data.comments]);
        } else {
          setComments(data.data.comments);
        }
        setNextCursor(data.data.nextCursor);
        setHasMoreComments(data.data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoadingComments(false);
      setLoadingMoreComments(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    const previousState = {
      isLiked: post.isLiked,
      likesCount: post.likesCount,
    };

    setPost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.likesCount + (post.isLiked ? -1 : 1),
    });

    try {
      await api.toggleLike(post.id);
    } catch {
      setPost({ ...post, ...previousState });
    }
  };

  const handleSendComment = async (text: string) => {
    if (!id) return;

    const token = await getAuthToken();
    await fetch(`https://k8s.mectest.ru/test-app/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
  };

  const loadMoreComments = () => {
    if (hasMoreComments && !loadingMoreComments && nextCursor) {
      fetchComments(nextCursor);
    }
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
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
          <TouchableOpacity onPress={() => router.back()}>
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

          <CommentList
            comments={comments}
            loading={loadingComments}
            loadingMore={loadingMoreComments}
            hasMore={hasMoreComments}
            onLoadMore={loadMoreComments}
          />
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
});

export default PostDetailScreen;
