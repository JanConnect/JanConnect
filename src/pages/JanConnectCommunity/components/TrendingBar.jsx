import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendingBar = ({ topics = [], onTopicClick }) => {
  const defaultTopics = [
    { id: '1', hashtag: '#GarbageCrisis', postCount: 234, trend: 'up' },
    { id: '2', hashtag: '#BrokenRoad', postCount: 156, trend: 'up' },
    { id: '3', hashtag: '#WaterLeak', postCount: 89, trend: 'up' },
    { id: '4', hashtag: '#Streetlight', postCount: 67, trend: 'steady' },
    { id: '5', hashtag: '#Pothole', postCount: 45, trend: 'down' },
    { id: '6', hashtag: '#Sewage', postCount: 34, trend: 'up' },
    { id: '7', hashtag: '#TreeFall', postCount: 23, trend: 'steady' },
  ];

  const displayTopics = topics.length > 0 ? topics : defaultTopics;

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-400" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-4">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="text-white/60 text-sm font-medium">Trending in your area</span>
      </div>
      
      <div className="flex overflow-x-auto gap-2 px-4 pb-2 scrollbar-thin scrollbar-thumb-white/20">
        {displayTopics.map((topic, index) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTopicClick?.(topic)}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 whitespace-nowrap hover:border-indigo-500/30 transition-colors"
          >
            <span className="text-indigo-400 font-medium">{topic.hashtag}</span>
            <span className="text-white/40 text-xs">{topic.postCount}</span>
            {getTrendIcon(topic.trend)}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TrendingBar;