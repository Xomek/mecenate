import type { PostsResponse, LikeResponse, Post, Comment } from "../types";
import { getAuthToken } from "./auth";

const BASE_URL = "https://k8s.mectest.ru/test-app";

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error?.code || "UNKNOWN_ERROR",
      data.error?.message || "An unknown error occurred",
    );
  }

  return data;
}

export const api = {
  getPosts: async (params: {
    limit?: number;
    cursor?: string | null;
    tier?: "free" | "paid";
    simulate_error?: boolean;
  }): Promise<PostsResponse> => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.cursor) searchParams.append("cursor", params.cursor);
    if (params.tier) searchParams.append("tier", params.tier);
    if (params.simulate_error) searchParams.append("simulate_error", "true");

    const query = searchParams.toString();
    return request<PostsResponse>(`/posts${query ? `?${query}` : ""}`);
  },

  getPost: async (
    postId: string,
  ): Promise<{ ok: boolean; data: { post: Post } }> => {
    return request(`/posts/${postId}`);
  },

  toggleLike: async (postId: string): Promise<LikeResponse> => {
    return request<LikeResponse>(`/posts/${postId}/like`, {
      method: "POST",
    });
  },

  getComments: async (
    postId: string,
    params?: { limit?: number; cursor?: string | null },
  ): Promise<{
    ok: boolean;
    data: {
      comments: Comment[];
      nextCursor: string | null;
      hasMore: boolean;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.cursor) searchParams.append("cursor", params.cursor);

    const query = searchParams.toString();
    return request(`/posts/${postId}/comments${query ? `?${query}` : ""}`);
  },

  addComment: async (
    postId: string,
    text: string,
  ): Promise<{
    ok: boolean;
    data: { comment: Comment };
  }> => {
    return request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },
};
