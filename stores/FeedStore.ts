import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../services/api";
import type { Post } from "../types";

export class FeedStore {
  posts: Post[] = [];
  nextCursor: string | null = null;
  hasMore: boolean = true;
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  isLoadingMore: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchFeed(refresh = false) {
    if (this.isLoading && !refresh) return;

    runInAction(() => {
      this.error = null;
      if (refresh) {
        this.isRefreshing = true;
      } else {
        this.isLoading = true;
      }
    });

    try {
      const response = await api.getPosts({ limit: 10 });

      runInAction(() => {
        if (response.ok) {
          this.posts = response.data.posts;
          this.nextCursor = response.data.nextCursor;
          this.hasMore = response.data.hasMore;
        } else {
          this.error = "Failed to load posts";
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          err instanceof Error
            ? err.message
            : "Не удалось загрузить публикации";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.isRefreshing = false;
      });
    }
  }

  async fetchMore() {
    if (!this.hasMore || this.isLoadingMore || this.isLoading) return;

    runInAction(() => {
      this.isLoadingMore = true;
      this.error = null;
    });

    try {
      const response = await api.getPosts({
        limit: 10,
        cursor: this.nextCursor,
      });

      runInAction(() => {
        if (response.ok) {
          this.posts = [...this.posts, ...response.data.posts];
          this.nextCursor = response.data.nextCursor;
          this.hasMore = response.data.hasMore;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.error =
          err instanceof Error
            ? err.message
            : "Не удалось загрузить публикации";
      });
    } finally {
      runInAction(() => {
        this.isLoadingMore = false;
      });
    }
  }

  async toggleLike(postId: string) {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = this.posts[postIndex];
    const previousState = {
      isLiked: post.isLiked,
      likesCount: post.likesCount,
    };

    runInAction(() => {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    });

    try {
      const response = await api.toggleLike(postId);

      runInAction(() => {
        if (response.ok) {
          post.isLiked = response.data.isLiked;
          post.likesCount = response.data.likesCount;
        } else {
          post.isLiked = previousState.isLiked;
          post.likesCount = previousState.likesCount;
        }
      });
    } catch {
      runInAction(() => {
        post.isLiked = previousState.isLiked;
        post.likesCount = previousState.likesCount;
      });
    }
  }

  clearError() {
    this.error = null;
  }

  async simulateError() {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      await api.getPosts({ simulate_error: true, limit: 10 });
    } catch (err) {
      runInAction(() => {
        this.error = "Не удалось загрузить публикации";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const feedStore = new FeedStore();
