// Theme Colors
export const COLORS = {
  background: '#0A0B0E',
  surface: 'rgba(18, 20, 24, 0.8)',
  primary: '#2D7EE7', // Nebula Blue
  success: '#00B37B', // Emerald Green
  warning: '#F59E0B', // Sunset Amber
  danger: '#E03B4B',  // Magma Red
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    tertiary: 'rgba(255,255,255,0.5)',
  },
  border: 'rgba(255,255,255,0.1)',
};

// Issue Status Types
export const ISSUE_STATUS = {
  REPORTED: 'Reported',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  VERIFIED: 'Verified',
  ASSIGNED: 'Assigned',
};

// Urgency Levels
export const URGENCY_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  CRITICAL: 'Critical',
};

// Filter Options
export const FILTER_TYPES = {
  NEAR_ME: 'nearMe',
  MY_MUNICIPALITY: 'myMunicipality',
  TRENDING_TODAY: 'trendingToday',
  MOST_ESCALATED: 'mostEscalated',
};

// Animation Config
export const ANIMATION = {
  spring: {
    damping: 15,
    stiffness: 150,
  },
  timing: {
    duration: 300,
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  GET_FEED: '/api/community/feed',
  GET_POST: '/api/community/post',
  CREATE_POST: '/api/community/post/create',
  SUPPORT_POST: '/api/community/post/support',
  COMMENT_POST: '/api/community/post/comment',
  ESCALATE_POST: '/api/community/post/escalate',
  AMPLIFY_POST: '/api/community/post/amplify',
  GET_TRENDING: '/api/community/trending',
  GET_LEADERBOARD: '/api/community/leaderboard',
};