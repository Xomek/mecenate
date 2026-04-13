import React, { useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { feedStore, TabType } from "../stores/FeedStore";
import { PostCard } from "../components/post";
import { FeedTabs } from "../components/FeedTabs";
import { ErrorView } from "../components/ErrorView";
import { tokens } from "../theme/tokens";
import { usePosts, useToggleLike } from "../services/hooks";

const FeedScreen = observer(() => {
  const router = useRouter();
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
    (postId: string) => {
      router.push(`/post/${postId}`);
    },
    [router],
  );

  const handleTabChange = useCallback((tab: TabType) => {
    feedStore.setActiveTab(tab);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.95}
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <ErrorView
          message="Не удалось загрузить публикации"
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
  listContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  loadingMore: {
    paddingVertical: tokens.spacing.lg,
  },
});

export default FeedScreen;
