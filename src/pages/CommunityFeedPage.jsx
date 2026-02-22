// src/pages/CommunityFeedPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CommunitySection from "./CommunitySection"; // Adjust path if needed

const CommunityFeedPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0E]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0E]/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </motion.button>
            <h1 className="text-xl font-bold text-white">Community Feed</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <CommunitySection user={user} />
      </main>
    </div>
  );
};

// THIS IS CRITICAL - Add default export
export default CommunityFeedPage;