import React, { useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
} from "react-native";
import { observer } from "mobx-react-lite";
import { feedStore } from "../stores/FeedStore";
import { ErrorView } from "../components/ErrorView";
import {
  LoadingIndicator,
  LoadingMoreIndicator,
} from "../components/LoadingIndicator";
import { tokens } from "../theme/tokens";
import { PostCard } from "../components/post";

const FeedScreen = observer(() => {
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <PostCard post={item} onLike={() => handleLike(item.id)} />
    ),
    [handleLike],
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
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (feedStore.error && feedStore.posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ErrorView message={feedStore.error} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
