// components/TrendingComplaints.js
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Clock, ArrowBigUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TrendingComplaints = ({ 
  sortedComplaints, 
  visibleComplaints, 
  upvotedComplaints, 
  getSeverityColor, 
  getSeverityIcon, 
  translateSeverity, 
  formatTimeAgo, 
  handleUpvote, 
  openComplaintDetail, 
  loadMoreComplaints, 
  showLessComplaints 
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-1/2 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {t("trendingComplaints")}
        </h2>
        <div className="flex items-center text-white/60 text-sm">
          <Users className="h-4 w-4 mr-1" />
          <span>
            {t("totalReports", { count: sortedComplaints.length })}
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {sortedComplaints
          .slice(0, visibleComplaints)
          .map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              onClick={() => openComplaintDetail(complaint)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-white font-medium">
                      {complaint.area}
                    </span>
                    <span
                      className={`ml-3 px-2 py-1 rounded-full text-xs border ${getSeverityColor(
                        complaint.severity
                      )}`}
                    >
                      {getSeverityIcon(complaint.severity)}{" "}
                      {translateSeverity(complaint.severity)}
                    </span>
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-2">
                    {complaint.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>
                        {complaint.reports} {t("reports")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimeAgo(complaint.time)}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col items-center ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    onClick={(e) => handleUpvote(complaint.id, e)}
                    className={`p-1 rounded-full ${
                      upvotedComplaints.has(complaint.id)
                        ? "bg-blue-500/30 text-blue-300"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    } transition-all duration-200`}
                    whileTap={{ scale: 0.9 }}
                    title={t("upvote")}
                  >
                    <ArrowBigUp className="h-4 w-4" />
                  </motion.button>
                  <span className="text-xs text-white/80 mt-1">
                    {complaint.upvotes}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {sortedComplaints.length > 5 && (
        <div className="mt-6 flex justify-center">
          {visibleComplaints < sortedComplaints.length ? (
            <motion.button
              onClick={loadMoreComplaints}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-white rounded-full border border-indigo-500/50 transition-all duration-300"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              {t("loadMore")} ({sortedComplaints.length - visibleComplaints}{" "}
              {t("remaining")})
            </motion.button>
          ) : (
            <motion.button
              onClick={showLessComplaints}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-gray-600/30 hover:bg-gray-600/40 text-white rounded-full border border-gray-500/50 transition-all duration-300"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              {t("showLess")}
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingComplaints;