import React, { useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { feedStore, TabType } from "../stores/FeedStore";
import { PostCard } from "../components/post";
import { FeedTabs } from "../components/FeedTabs";
import { ErrorView } from "../components/ErrorView";
import {
  LoadingIndicator,
  LoadingMoreIndicator,
} from "../components/LoadingIndicator";
import { tokens } from "../theme/tokens";

const FeedScreen = observer(() => {
  const router = useRouter();

  useEffect(() => {
    feedStore.fetchFeed();
  }, []);

  const handleRefresh = useCallback(() => {
    feedStore.fetchFeed(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    feedStore.fetchMore();
  }, []);

  const handleRetry = useCallback(() => {
    feedStore.clearError();
    feedStore.fetchFeed();
  }, []);

  const handleLike = useCallback((postId: string) => {
    feedStore.toggleLike(postId);
  }, []);

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

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!feedStore.isLoadingMore) return null;
    return <LoadingMoreIndicator />;
  }, [feedStore.isLoadingMore]);

  if (feedStore.isLoading && feedStore.posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (feedStore.error && feedStore.posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FeedTabs
          activeTab={feedStore.activeTab}
          onTabChange={handleTabChange}
        />
        <ErrorView message={feedStore.error} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FeedTabs activeTab={feedStore.activeTab} onTabChange={handleTabChange} />

      <FlatList
        data={feedStore.posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={feedStore.isRefreshing}
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
  listContent: {
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
});

export default FeedScreen;
