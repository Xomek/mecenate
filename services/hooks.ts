import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "../types";

export const queryKeys = {
  posts: (tier?: string) => ["posts", tier] as const,
  post: (id: string) => ["post", id] as const,
  comments: (postId: string) => ["comments", postId] as const,
};

export const usePosts = (tier?: "free" | "paid") => {
  return useInfiniteQuery({
    queryKey: queryKeys.posts(tier),
    queryFn: ({ pageParam }) =>
      api.getPosts({ limit: 10, cursor: pageParam, tier }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => api.getPost(id),
    enabled: !!id,
  });
};

export const useComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: ({ pageParam }) =>
      api.getComments(postId, { limit: 20, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    enabled: !!postId,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.toggleLike,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p: Post) =>
                p.id === postId
                  ? {
                      ...p,
                      isLiked: !p.isLiked,
                      likesCount: p.likesCount + (p.isLiked ? -1 : 1),
                    }
                  : p,
              ),
            },
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueriesData(
          { queryKey: ["posts"] },
          context.previousPosts,
        );
      }
    },
  });
};

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => api.addComment(postId, text),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.comments(postId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: {
                ...old.pages[0].data,
                comments: [data.data.comment, ...old.pages[0].data.comments],
              },
            },
            ...old.pages.slice(1),
          ],
        };
      });
    },
  });
};
