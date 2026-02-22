/**
 * Calculate trending score based on engagement metrics
 * Formula: score = (supports × 2) + (comments × 3) + (shares × 4) + views
 * 
 * @param {Object} params - Engagement metrics
 * @param {number} params.supports - Number of supports
 * @param {number} params.comments - Number of comments
 * @param {number} params.shares - Number of shares
 * @param {number} params.views - Number of views
 * @param {boolean} params.timeDecay - Apply time-based decay (default: true)
 * @param {Date} params.createdAt - Post creation date (required if timeDecay true)
 * @returns {number} Trending score
 */
export const calculateTrendingScore = ({
  supports = 0,
  comments = 0,
  shares = 0,
  views = 0,
  timeDecay = true,
  createdAt = new Date(),
}) => {
  // Base score calculation
  const baseScore = (supports * 2) + (comments * 3) + (shares * 4) + views;
  
  if (!timeDecay) return baseScore;

  // Time decay factor (posts lose "heat" over time)
  const hoursSincePost = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  const decayFactor = Math.exp(-hoursSincePost / 24); // 24-hour half-life
  
  return Math.round(baseScore * decayFactor);
};

/**
 * Aggregate trending hashtags from posts
 * @param {Array} posts - Array of posts
 * @returns {Array} Sorted trending hashtags
 */
export const aggregateTrendingHashtags = (posts = []) => {
  const hashtagMap = new Map();

  posts.forEach(post => {
    if (post.hashtags && Array.isArray(post.hashtags)) {
      post.hashtags.forEach(tag => {
        const current = hashtagMap.get(tag) || { count: 0, score: 0 };
        hashtagMap.set(tag, {
          id: tag,
          hashtag: `#${tag}`,
          count: current.count + 1,
          score: current.score + (post.trendingScore || 0),
        });
      });
    }
  });

  return Array.from(hashtagMap.values())
    .map(({ id, hashtag, count, score }) => ({
      id,
      hashtag,
      postCount: count,
      trendingScore: score,
    }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 10);
};

/**
 * Calculate trending velocity (rate of engagement)
 * @param {Array} engagementHistory - Array of engagement timestamps
 * @returns {number} Velocity score
 */
export const calculateTrendingVelocity = (engagementHistory = []) => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  const recentEngagements = engagementHistory.filter(
    timestamp => new Date(timestamp).getTime() > oneHourAgo
  );
  
  return recentEngagements.length;
};