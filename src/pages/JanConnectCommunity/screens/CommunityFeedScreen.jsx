import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import VideoCard from '../components/VideoCard';
import TrendingBar from '../components/TrendingBar';
import FilterChips from '../components/FilterChips';
import { useCommunityFeed } from '../hooks/useCommunityFeed';
import { COLORS, FILTER_TYPES } from '../utils/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CommunityFeedScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.TRENDING_TODAY);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const { posts, trendingTopics, isLoading, refreshFeed } = useCommunityFeed(activeFilter);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const renderItem = ({ item, index }) => (
    <VideoCard 
      post={item} 
      isActive={index === activeVideoIndex}
    />
  );

  const handleCameraPress = () => {
    // Navigate to your existing camera screen
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with Blur */}
      <BlurView intensity={80} tint="dark" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>JanConnect</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={22} color={COLORS.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Trending Topics Section */}
        <TrendingBar topics={trendingTopics} />
        
        {/* Filter Chips */}
        <FilterChips 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </BlurView>

      {/* Vertical Reel Feed */}
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        onRefresh={refreshFeed}
        refreshing={isLoading}
      />

      {/* Floating Action Button for New Post */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCameraPress}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logo: {
    color: COLORS.text.primary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
  },
  iconButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 101,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default CommunityFeedScreen;