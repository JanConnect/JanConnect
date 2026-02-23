// src/pages/CommunityFeedPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Flame, 
  Clock, 
  TrendingUp, 
  ChevronUp,
  X,
  Image,
  MapPin,
  Globe,
  Users,
  AlertCircle,
  Camera,
  Smile,
  Calendar
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

const postTypes = [
  { id: "issue", label: "Report Issue", icon: AlertCircle, color: "bg-red-500" },
  { id: "photo", label: "Photo", icon: Image, color: "bg-green-500" },
  { id: "video", label: "Video", icon: Camera, color: "bg-purple-500" },
  { id: "update", label: "Update", icon: Calendar, color: "bg-blue-500" },
];

const CommunityFeedPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState("hot");
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

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
    return user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U";
  };

  const handleNewPost = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedPostType(null);
    setPostContent("");
    setPostTitle("");
    setPostLocation("");
    setSelectedImage(null);
  };

  const handleSelectPostType = (type) => {
    setSelectedPostType(type);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !selectedImage) return;
    
    setIsPosting(true);
    
    // Simulate post creation
    setTimeout(() => {
      // Here you would typically send the post to your backend
      console.log("New post created:", {
        type: selectedPostType?.id || "issue",
        title: postTitle,
        content: postContent,
        location: postLocation,
        image: selectedImage,
        user: user?.username || "Anonymous",
        timestamp: new Date().toISOString(),
      });
      
      setIsPosting(false);
      handleCloseModal();
      
      // Optional: Show a success message or add the post to the feed
      alert("Post created successfully!");
    }, 1500);
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
            
            <button 
              onClick={handleNewPost}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#f48024] text-white rounded-full text-[14px] font-semibold hover:bg-[#e0701c] transition-colors"
            >
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

      {/* Create Post Modal - Instagram Style */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedPostType ? `Create ${selectedPostType.label}` : "Create new post"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 130px)" }}>
                {!selectedPostType ? (
                  // Post Type Selection - Instagram Story-style
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">What would you like to share?</p>
                    <div className="grid grid-cols-2 gap-3">
                      {postTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectPostType(type)}
                            className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-[#f48024] hover:bg-orange-50 transition-all"
                          >
                            <div className={`w-14 h-14 ${type.color} rounded-full flex items-center justify-center text-white`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Post Creation Form
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f48024] to-orange-500 flex items-center justify-center text-white font-bold">
                        {getUserDisplay()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.username || "Anonymous"}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Globe className="w-3 h-3" />
                          <span>Public</span>
                        </div>
                      </div>
                    </div>

                    {/* Title Input (for issues) */}
                    {selectedPostType.id === "issue" && (
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Post title..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48024]/30 focus:border-[#f48024]"
                      />
                    )}

                    {/* Content Input */}
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={selectedPostType.id === "issue" 
                        ? "Describe the issue in detail..." 
                        : selectedPostType.id === "update"
                        ? "Share an update with the community..."
                        : "Write a caption..."}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f48024]/30 focus:border-[#f48024] resize-none"
                    />

                    {/* Image/Video Upload */}
                    {(selectedPostType.id === "photo" || selectedPostType.id === "video") && (
                      <div className="space-y-3">
                        {selectedImage ? (
                          <div className="relative rounded-xl overflow-hidden">
                            <img 
                              src={selectedImage} 
                              alt="Preview" 
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#f48024] hover:bg-orange-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Click to upload {selectedPostType.id}</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept={selectedPostType.id === "photo" ? "image/*" : "video/*"}
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={postLocation}
                        onChange={(e) => setPostLocation(e.target.value)}
                        placeholder="Add location"
                        className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Audience Selector */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-[14px] text-gray-700">Audience</span>
                      </div>
                      <select className="bg-transparent text-[14px] font-medium text-gray-900 focus:outline-none">
                        <option>Public</option>
                        <option>Community only</option>
                        <option>Followers only</option>
                      </select>
                    </div>

                    {/* Add to your story option (for photos) */}
                    {selectedPostType.id === "photo" && (
                      <div className="flex items-center gap-2 p-3">
                        <input type="checkbox" id="addToStory" className="rounded text-[#f48024] focus:ring-[#f48024]" />
                        <label htmlFor="addToStory" className="text-[14px] text-gray-700">
                          Also add to your story
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              {selectedPostType && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedPostType(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreatePost}
                      disabled={isPosting || (!postContent.trim() && !selectedImage && !postTitle.trim())}
                      className="flex-1 px-4 py-2.5 bg-[#f48024] text-white rounded-xl text-[14px] font-semibold hover:bg-[#e0701c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPosting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Posting...</span>
                        </div>
                      ) : (
                        "Post"
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

          {/* Right Sidebar - Pass the handleNewPost function */}
          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <CommunitySidebar onCreatePost={handleNewPost} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CommunityFeedPage;