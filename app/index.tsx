import React, { useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { feedStore, TabType } from "../stores/FeedStore";
import { usePosts, useToggleLike } from "../services/hooks";
import { PostCard } from "../components/post";
import { FeedTabs } from "../components/FeedTabs";
import { tokens } from "../theme/tokens";
import { ErrorView } from "../components/error/ErrorView";

const FeedScreen = observer(() => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tier = feedStore.activeTab === "all" ? undefined : feedStore.activeTab;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    error,
  } = usePosts(tier);

  const { mutate: toggleLike } = useToggleLike();

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLike = useCallback(
    (postId: string) => {
      toggleLike(postId);
    },
    [toggleLike],
  );

  const handlePostPress = useCallback(
    (post: any) => {
      if (post.tier === "paid") {
        return;
      }
      router.push(`/post/${post.id}`);
    },
    [router],
  );

  const handleTabChange = useCallback((tab: TabType) => {
    feedStore.setActiveTab(tab);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => handlePostPress(item)}
        activeOpacity={item.tier === "paid" ? 1 : 0.95}
      >
        <PostCard post={item} onLike={() => handleLike(item.id)} />
      </TouchableOpacity>
    ),
    [handlePostPress, handleLike],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <ActivityIndicator
        style={styles.loadingMore}
        color={tokens.colors.primary}
      />
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={tokens.colors.background}
        />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={tokens.colors.background}
        />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <ErrorView
          message="Не удалось загрузить публикации"
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
      <FeedTabs activeTab={feedStore.activeTab} onTabChange={handleTabChange} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={tokens.colors.primary}
            colors={[tokens.colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  listContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  loadingMore: {
    paddingVertical: tokens.spacing.lg,
  },
});

export default FeedScreen;
