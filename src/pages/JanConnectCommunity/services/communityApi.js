// Mock API service - Replace with actual API calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityApi = {
  /**
   * Get community feed
   * @param {string} filterType - Filter type
   * @param {number} page - Page number
   * @returns {Promise} Feed data
   */
  getFeed: async (filterType = 'trending', page = 1) => {
    await delay(800);
    
    // Mock response
    return {
      success: true,
      data: {
        posts: [],
        trendingTopics: [],
        hasMore: page < 5,
        nextPage: page + 1,
      },
    };
  },

  /**
   * Get single post
   * @param {string} postId - Post ID
   * @returns {Promise} Post data
   */
  getPost: async (postId) => {
    await delay(300);
    
    return {
      success: true,
      data: {
        id: postId,
        // ... post data
      },
    };
  },

  /**
   * Create new post
   * @param {Object} postData - Post data
   * @returns {Promise} Created post
   */
  createPost: async (postData) => {
    await delay(1000);
    
    return {
      success: true,
      data: {
        id: `post-${Date.now()}`,
        ...postData,
        createdAt: new Date(),
      },
    };
  },

  /**
   * Support a post
   * @param {string} postId - Post ID
   * @returns {Promise} Result
   */
  supportPost: async (postId) => {
    await delay(200);
    
    return {
      success: true,
      message: 'Post supported successfully',
    };
  },

  /**
   * Add comment to post
   * @param {string} postId - Post ID
   * @param {string} comment - Comment text
   * @returns {Promise} Result
   */
  addComment: async (postId, comment) => {
    await delay(300);
    
    return {
      success: true,
      data: {
        id: `comment-${Date.now()}`,
        postId,
        comment,
        createdAt: new Date(),
      },
    };
  },

  /**
   * Escalate post to authorities
   * @param {string} postId - Post ID
   * @param {string} reason - Escalation reason
   * @returns {Promise} Result
   */
  escalatePost: async (postId, reason) => {
    await delay(400);
    
    return {
      success: true,
      message: 'Post escalated to authorities',
      data: {
        escalationId: `esc-${Date.now()}`,
        acknowledged: true,
      },
    };
  },

  /**
   * Amplify post
   * @param {string} postId - Post ID
   * @returns {Promise} Result
   */
  amplifyPost: async (postId) => {
    await delay(200);
    
    return {
      success: true,
      message: 'Post amplified successfully',
    };
  },

  /**
   * Get trending topics
   * @returns {Promise} Trending topics
   */
  getTrendingTopics: async () => {
    await delay(300);
    
    return {
      success: true,
      data: [
        { id: 1, hashtag: '#GarbageCrisis', posts: 234 },
        { id: 2, hashtag: '#BrokenRoad', posts: 156 },
        { id: 3, hashtag: '#WaterLeak', posts: 89 },
        { id: 4, hashtag: '#Streetlight', posts: 67 },
        { id: 5, hashtag: '#Pothole', posts: 45 },
      ],
    };
  },

  /**
   * Get civic leaderboard
   * @returns {Promise} Leaderboard data
   */
  getLeaderboard: async () => {
    await delay(300);
    
    return {
      success: true,
      data: [
        { id: 1, name: 'EcoWarrior', score: 2450, badge: '🏆' },
        { id: 2, name: 'CleanCityAdvocate', score: 2100, badge: '🥈' },
        { id: 3, name: 'RoadSafetyHero', score: 1875, badge: '🥉' },
      ],
    };
  },
};