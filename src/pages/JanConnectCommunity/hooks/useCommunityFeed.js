import { useState, useEffect, useCallback } from 'react';
import { calculateTrendingScore, aggregateTrendingHashtags } from '../utils/trendingFormula';
import { communityApi } from '../services/communityApi';

// Mock data generator (replace with actual API calls)
const generateMockPosts = () => {
  const statuses = ['Reported', 'In Progress', 'Resolved', 'Verified', 'Assigned'];
  const urgencies = ['Low', 'Moderate', 'Critical'];
  const hashtagsList = [
    ['GarbageCrisis', 'CleanCity'],
    ['BrokenRoad', 'Infrastructure'],
    ['WaterLeak', 'SaveWater'],
    ['Streetlight', 'Safety'],
    ['Pothole', 'RoadSafety'],
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const supports = Math.floor(Math.random() * 500);
    const comments = Math.floor(Math.random() * 100);
    const shares = Math.floor(Math.random() * 50);
    const views = Math.floor(Math.random() * 5000);
    const hashtags = hashtagsList[Math.floor(Math.random() * hashtagsList.length)];
    
    return {
      id: `post-${i}`,
      videoUrl: '/videos/sample.mp4',
      thumbnailUrl: '/images/thumbnails/sample.jpg',
      caption: `This is a sample civic issue post #${hashtags[0]}`,
      hashtags,
      location: {
        name: 'Connaught Place, New Delhi',
        coordinates: { lat: 28.6328, lng: 77.2197 },
      },
      user: {
        id: `user-${i}`,
        username: `citizen_${i}`,
        avatar: `https://i.pravatar.cc/150?u=${i}`,
        isVerified: i % 3 === 0,
        isAuthority: i % 5 === 0,
        civicScore: Math.floor(Math.random() * 1000),
      },
      stats: {
        supports,
        comments,
        shares,
        views,
        escalations: Math.floor(Math.random() * 20),
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      trendingScore: 0,
      authorityResponse: i % 4 === 0 ? {
        comment: "We've assigned this to the concerned department.",
        pinned: true,
        respondedAt: new Date(),
      } : null,
      comments: [],
    };
  }).map(post => ({
    ...post,
    trendingScore: calculateTrendingScore({
      supports: post.stats.supports,
      comments: post.stats.comments,
      shares: post.stats.shares,
      views: post.stats.views,
      createdAt: post.createdAt,
    }),
  }));
};

export const useCommunityFeed = (filterType = 'trendingToday') => {
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
      setPage(1);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Replace with actual API call
      // const response = await communityApi.getFeed(filterType, refresh ? 1 : page);
      
      // Using mock data for now
      const mockPosts = generateMockPosts();
      
      // Apply filter
      let filteredPosts = [...mockPosts];
      switch (filterType) {
        case 'nearMe':
          filteredPosts = filteredPosts.sort((a, b) => 0.5 - Math.random());
          break;
        case 'myMunicipality':
          filteredPosts = filteredPosts.filter(p => p.location.name.includes('Delhi'));
          break;
        case 'trendingToday':
          filteredPosts = filteredPosts.sort((a, b) => b.trendingScore - a.trendingScore);
          break;
        case 'mostEscalated':
          filteredPosts = filteredPosts.sort((a, b) => b.stats.escalations - a.stats.escalations);
          break;
        default:
          break;
      }
      
      // Calculate trending hashtags
      const topics = aggregateTrendingHashtags(filteredPosts);
      
      setPosts(prev => refresh ? filteredPosts : [...prev, ...filteredPosts]);
      setTrendingTopics(topics);
      setHasMore(filteredPosts.length === 10);
      setPage(prev => refresh ? 2 : prev + 1);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching community feed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filterType, page]);

  // Refresh feed
  const refreshFeed = useCallback(() => {
    fetchFeed(true);
  }, [fetchFeed]);

  // Load more posts (pagination)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchFeed();
    }
  }, [isLoading, hasMore, fetchFeed]);

  // Initial fetch
  useEffect(() => {
    fetchFeed(true);
  }, [filterType]);

  return {
    posts,
    trendingTopics,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    refreshFeed,
    loadMore,
  };
};