// src/pages/JanConnectCommunity/components/CommunitySidebar.tsx
import React from "react";
import { 
  TrendingUp, 
  Droplets, 
  Wrench, 
  Leaf, 
  Lightbulb, 
  ShieldAlert 
} from "lucide-react";

interface CommunitySidebarProps {
  onCreatePost?: () => void;
}

const trendingProblems = [
  { topic: "WaterCrisis", posts: "234 posts", Icon: Droplets },
  { topic: "RoadRepair", posts: "189 posts", Icon: Wrench },
  { topic: "CleanCity", posts: "156 posts", Icon: Leaf },
  { topic: "StreetLights", posts: "98 posts", Icon: Lightbulb },
  { topic: "PublicSafety", posts: "87 posts", Icon: ShieldAlert },
];

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ onCreatePost }) => {
  return (
    <aside className="space-y-6 font-sans">
      
      {/* About Community */}
      <div className="bg-[#FFF7F2] rounded-2xl p-6 border border-[#FCECE3] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[#f48024] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            J
          </div>
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold text-gray-900 leading-tight">r/janconnect</h3>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Civic engagement community</p>
          </div>
        </div>
        
        <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
          A place to discuss and report civic issues in your locality. Join the movement for better governance.
        </p>
        
        <div className="flex gap-8 mb-6 pb-2">
          <div className="flex flex-col">
            <p className="text-[19px] font-extrabold text-gray-900">12.4k</p>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mt-1">Members</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[19px] font-extrabold text-gray-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              384
            </p>
            <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mt-1">Online</p>
          </div>
        </div>
        
        {/* Removed "Created 2 years ago" section */}
        
        <button 
          onClick={onCreatePost}
          className="w-full py-2.5 rounded-full bg-[#f48024] text-white font-semibold text-[14px] hover:bg-[#e0701c] transition-colors shadow-sm"
        >
          Create Post
        </button>
      </div>

      {/* Trending Problems */}
      <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#f48024]" strokeWidth={2.5} />
          <h3 className="text-[13px] font-bold text-gray-500 tracking-[0.08em] uppercase">
            Trending Problems
          </h3>
        </div>
        <div className="space-y-5">
          {trendingProblems.map((item, i) => {
            const IconComponent = item.Icon;
            return (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-white border border-gray-100 shadow-sm group-hover:border-[#f48024]/30 transition-colors">
                    <IconComponent className="w-4 h-4 text-[#f48024]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[15px] font-bold text-gray-800 group-hover:text-[#f48024] transition-colors">
                    #{item.topic}
                  </span>
                </div>
                <span className="text-[13px] font-medium text-gray-400">
                  {item.posts}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moderators section removed */}
      
    </aside>
  );
};

export default CommunitySidebar;