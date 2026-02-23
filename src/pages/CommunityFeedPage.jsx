// src/pages/CommunityFeedPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Flame, 
  Clock, 
  TrendingUp, 
  ChevronUp 
} from "lucide-react";
import PostCard from "./JanConnectCommunity/components/PostCard";
import CommunitySidebar from "./JanConnectCommunity/components/CommunitySidebar";

// Mock posts data
const postsData = [
  {
    id: 1,
    title: "Major garbage dump in Sector 17 needs immediate attention",
    content:
      "This has been here for over a week. The smell is unbearable and it's becoming a health hazard. Multiple complaints filed but no action yet.",
    community: "janconnect",
    author: "civic_activist",
    authorAvatar: "https://i.pravatar.cc/150?u=101",
    timestamp: "5 hours ago",
    upvotes: 1247,
    downvotes: 89,
    comments: 89,
    shares: 34,
    awards: ["helpful"],
    flair: "High Urgency",
    flairColor: "red",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600",
    isPinned: true,
    location: "Sector 17, Chandigarh",
  },
  {
    id: 2,
    title: "Broken street lights on Main Road causing accidents at night",
    content:
      "Three accidents reported this week alone. The entire stretch from City Center to North Avenue is pitch dark.",
    community: "janconnect",
    author: "night_rider",
    authorAvatar: "https://i.pravatar.cc/150?u=102",
    timestamp: "12 hours ago",
    upvotes: 892,
    downvotes: 23,
    comments: 156,
    shares: 78,
    awards: ["silver"],
    flair: "Infrastructure",
    flairColor: "blue",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    location: "Main Road, City Center",
  },
  {
    id: 3,
    title: "Water pipeline burst — Thousands without supply since morning",
    content:
      "The main supply line near Gandhi Chowk burst at 6 AM. No updates from municipal corporation despite multiple calls.",
    community: "janconnect",
    author: "water_warrior",
    authorAvatar: "https://i.pravatar.cc/150?u=103",
    timestamp: "1 day ago",
    upvotes: 2156,
    downvotes: 45,
    comments: 342,
    shares: 567,
    awards: ["gold", "platinum"],
    flair: "Emergency",
    flairColor: "red",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600",
    location: "Gandhi Chowk",
  },
  {
    id: 4,
    title: "Open manhole cover on Pedestrian Street — Dangerous!",
    content:
      "This manhole has been open for 3 days. Someone could get seriously hurt. @MunicipalCorp please fix immediately.",
    community: "janconnect",
    author: "safety_first",
    authorAvatar: "https://i.pravatar.cc/150?u=104",
    timestamp: "2 days ago",
    upvotes: 567,
    downvotes: 12,
    comments: 45,
    shares: 89,
    awards: ["helpful"],
    flair: "Safety Hazard",
    flairColor: "orange",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    location: "Pedestrian Street, Market Area",
  },
];

const filters = [
  { id: "hot", icon: Flame, label: "Hot" },
  { id: "new", icon: Clock, label: "New" },
  { id: "top", icon: TrendingUp, label: "Top" },
  { id: "rising", icon: ChevronUp, label: "Rising" },
];

const CommunityFeedPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState("hot");
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const getUserDisplay = () => {
    if (!user) return "U";
    return user.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Unified Header matching the image */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left section: Back Button, Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f48024] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <div className="flex flex-col">
                <h1 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
                  Community
                </h1>
                <span className="text-[13px] text-gray-500 leading-tight">
                  janconnect
                </span>
              </div>
            </div>
          </div>

          {/* Middle section: Navigation Filters */}
          <div className="hidden lg:flex items-center gap-1">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#f48024] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Right section: Search, Action Button & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-[18px] h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-[14px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48024]/30 w-64 transition-all"
              />
            </div>
            
            <button className="flex items-center gap-1.5 px-5 py-2 bg-[#f48024] text-white rounded-full text-[14px] font-semibold hover:bg-[#e0701c] transition-colors">
              <Plus className="w-4 h-4" strokeWidth={3} />
              New Post
            </button>

            {user && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold cursor-pointer ml-2">
                {getUserDisplay()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6 pt-24">
        <div className="flex gap-6">
          
          {/* Main Feed */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              {postsData.map((post, i) => (
                <React.Fragment key={post.id}>
                  <PostCard
                    post={post}
                    isActiveVideo={activeVideoId === post.id}
                    onVideoVisible={setActiveVideoId}
                  />
                </React.Fragment>
              ))}
            </div>

            {/* Load more */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-6 py-3 rounded-lg border border-gray-200 bg-white text-[14px] font-semibold text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
            >
              Load More Posts
            </motion.button>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <CommunitySidebar />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CommunityFeedPage;