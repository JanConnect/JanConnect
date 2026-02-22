// Main export file for JanConnect Community Feature
export { default as CommunityFeedScreen } from './screens/CommunityFeedScreen';
export { default as VideoCard } from './components/VideoCard';
export { default as TrendingBar } from './components/TrendingBar';
export { default as FilterChips } from './components/FilterChips';
export { default as ActionBar } from './components/ActionBar';
export { default as StatusBadge } from './components/StatusBadge';
export { default as UrgencyIndicator } from './components/UrgencyIndicator';
export { default as AuthorityPinnedComment } from './components/AuthorityPinnedComment';
export { default as ResolutionTimeline } from './components/ResolutionTimeline';
export { default as CivicLeaderboard } from './components/CivicLeaderboard';

export { useCommunityFeed } from './hooks/useCommunityFeed';
export { useVideoPlayer } from './hooks/useVideoPlayer';
export { useCommunityStore } from './store/communityStore';

export { calculateTrendingScore, aggregateTrendingHashtags } from './utils/trendingFormula';
export { calculateDistance, filterNearMe } from './utils/locationUtils';
export { COLORS, ISSUE_STATUS, URGENCY_LEVELS, FILTER_TYPES } from './utils/constants';

export { escalateToAuthority, getEscalationStatus } from './services/escalationService';
export { communityApi } from './services/communityApi';