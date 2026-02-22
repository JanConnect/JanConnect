import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCommunityStore = create(
  persist(
    (set, get) => ({
      // State
      posts: [],
      trendingTopics: [],
      activeFilter: 'trendingToday',
      userSupports: {},
      userEscalations: {},
      userAmplifications: {},
      savedPosts: [],
      userProfile: null,
      
      // Actions
      setPosts: (posts) => set({ posts }),

      setTrendingTopics: (topics) => set({ trendingTopics: topics }),

      setFilter: (filter) => set({ activeFilter: filter }),

      supportPost: (postId) => {
        const { posts, userSupports } = get();
        if (userSupports[postId]) return;

        const updatedPosts = posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                stats: { 
                  ...post.stats, 
                  supports: (post.stats?.supports || 0) + 1 
                },
                trendingScore: (post.trendingScore || 0) + 2
              }
            : post
        );

        set({
          posts: updatedPosts,
          userSupports: { ...userSupports, [postId]: true },
        });

        // You can also trigger an API call here
        // communityApi.supportPost(postId);
      },

      escalatePost: (postId, reason = '') => {
        const { posts, userEscalations } = get();
        if (userEscalations[postId]) return;

        const updatedPosts = posts.map(post =>
          post.id === postId
            ? {
                ...post,
                stats: {
                  ...post.stats,
                  escalations: (post.stats?.escalations || 0) + 1,
                },
                urgency: (post.stats?.escalations || 0) > 10 ? 'Critical' : post.urgency,
              }
            : post
        );

        set({
          posts: updatedPosts,
          userEscalations: { ...userEscalations, [postId]: true },
        });

        // Trigger authority notification
        // escalateToAuthority(postId, get().userProfile, { reason });
      },

      amplifyPost: (postId) => {
        const { posts, userAmplifications } = get();
        if (userAmplifications[postId]) return;

        const updatedPosts = posts.map(post =>
          post.id === postId
            ? {
                ...post,
                trendingScore: (post.trendingScore || 0) + 5,
              }
            : post
        );

        set({
          posts: updatedPosts,
          userAmplifications: { ...userAmplifications, [postId]: true },
        });
      },

      addComment: (postId, comment) => {
        const { posts } = get();
        const newComment = {
          id: `comment-${Date.now()}`,
          ...comment,
          createdAt: new Date(),
        };

        const updatedPosts = posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
                stats: {
                  ...post.stats,
                  comments: (post.stats?.comments || 0) + 1,
                },
                trendingScore: (post.trendingScore || 0) + 3,
              }
            : post
        );
        set({ posts: updatedPosts });
        return newComment;
      },

      updatePostStatus: (postId, status, timelineUpdate = {}) => {
        const { posts } = get();
        const updatedPosts = posts.map(post =>
          post.id === postId 
            ? { 
                ...post, 
                status,
                resolutionTimeline: { ...post.resolutionTimeline, ...timelineUpdate }
              } 
            : post
        );
        set({ posts: updatedPosts });
      },

      savePost: (postId) => {
        const { posts, savedPosts } = get();
        const post = posts.find(p => p.id === postId);
        if (post && !savedPosts.some(p => p.id === postId)) {
          set({ savedPosts: [...savedPosts, post] });
        }
      },

      unsavePost: (postId) => {
        const { savedPosts } = get();
        set({ savedPosts: savedPosts.filter(p => p.id !== postId) });
      },

      setUserProfile: (profile) => set({ userProfile: profile }),

      clearUserInteractions: () => {
        set({
          userSupports: {},
          userEscalations: {},
          userAmplifications: {},
        });
      },

      reset: () => {
        set({
          posts: [],
          trendingTopics: [],
          activeFilter: 'trendingToday',
          userSupports: {},
          userEscalations: {},
          userAmplifications: {},
          savedPosts: [],
        });
      },
    }),
    {
      name: 'community-store',
      getStorage: () => localStorage,
      partialize: (state) => ({
        savedPosts: state.savedPosts,
        userSupports: state.userSupports,
        userEscalations: state.userEscalations,
        userAmplifications: state.userAmplifications,
      }),
    }
  )
);