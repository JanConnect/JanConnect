import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const CommunityCard = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigateToCommunity = () => {
    if (userId) {
      navigate(`/user/${userId}/community`);
    } else {
      navigate("/community");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-7xl mx-auto mt-8 px-4"
    >
      <div className="relative p-6 md:p-8">
        {/* Header with bold text and button */}
        <div className="flex items-start justify-between">
          {/* Left side - Dramatic Font Text */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.05em] leading-[1.1] ml-[-80px] font-['Anton',_sans-serif]">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.7)]">#ZeroCivicSense</span> with JanConnect Community !
            </h2>
          </div>

          {/* Right side - Button and Faces */}
          <div className="flex flex-col items-end mr-[-16px]">
            {/* Explore Community Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigateToCommunity}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 p-[2px] shadow-[0_0_15px_rgba(217,70,239,0.5)]"
            >
              <div className="relative flex items-center justify-center gap-2 px-6 py-3 transition-all group-hover:bg-transparent">
                <span className="text-white font-bold text-base drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  EXPLORE COMMUNITY DEED
                </span>
                <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]"></div>
              </div>
            </motion.button>

            {/* Active Users Indicator - Little People (below button) */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/32?u=${i}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-[#0A0B0E] ring-2 ring-fuchsia-500/30"
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 border-2 border-[#0A0B0E] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                  +12
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;