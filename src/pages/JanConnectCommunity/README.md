# JanConnect Community Feature

A GenZ-style civic engagement social feed for reporting real-world problems.

## Quick Integration

### 1. Add to Navigation

```jsx
// In your App.js or navigation file
import { CommunityFeedScreen } from './src/features/JanConnectCommunity';

// Add to your stack navigator
<Stack.Screen 
  name="Community" 
  component={CommunityFeedScreen}
  options={{ headerShown: false }}
/>
```

### 2. Add Tab Bar Item (Optional)

```jsx
// In your tab navigator
<Tab.Screen 
  name="JanConnect" 
  component={CommunityFeedScreen}
  options={{
    tabBarIcon: ({ color }) => (
      <Ionicons name="people" size={24} color={color} />
    ),
  }}
/>
```

### 3. Install Dependencies

```bash
npx expo install expo-av expo-blur expo-haptics zustand
```

### 4. Required Environment Variables

```env
# Add to your .env file
JANCONNECT_API_URL=your_api_endpoint
JANCONNECT_MUNICIPALITY_ID=your_city_id
```

## Features Included

✅ **Reel-style video feed** - Vertical scroll, auto-play
✅ **Civic engagement** - Support instead of likes, escalate to authorities
✅ **Trending system** - Smart scoring with time decay
✅ **Status tracking** - Reported → Verified → Assigned → Resolved
✅ **Gamification** - Civic Hero badges, leaderboards
✅ **Dark mode** - GenZ aesthetic with glassmorphism
✅ **Micro-interactions** - Haptic feedback, animations

## Customization

### Update API Endpoints

In `src/features/JanConnectCommunity/hooks/useCommunityFeed.js`, replace mock data with your API calls:

```jsx
// Replace this:
const mockPosts = generateMockPosts();

// With this:
const response = await api.get(`/community/feed?filter=${filterType}`);
const posts = response.data;
```

### Modify Trending Formula

In `src/features/JanConnectCommunity/utils/trendingFormula.js`, adjust weights:

```javascript
// Default: supports×2, comments×3, shares×4, views
// Change to your preferred weights
const baseScore = (supports * 2) + (comments * 3) + (shares * 4) + views;
```

## File Structure

```
JanConnectCommunity/
├── screens/          # Main screens
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── services/         # API services
├── store/            # State management
└── styles/           # Shared styles
```

## Support

For issues or questions, contact your development team.