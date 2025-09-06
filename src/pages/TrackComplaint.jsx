import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Clock, CheckCircle, XCircle, AlertTriangle, 
  FileText, Calendar, MapPin, Building, User, Loader2, Plus, Star,
  ChevronDown, ChevronUp
} from "lucide-react";
import { getUserReports } from '../api/report';
import { useTranslation } from "react-i18next"; // Add this import

export default function TrackComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation(); // Add this hook
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null); // For inline details
  const [detailModalOpen, setDetailModalOpen] = useState(false); // For detailed modal view

  useEffect(() => {
    const fetchUserComplaints = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await getUserReports({ page: 1, limit: 50 });
        const complaintsData = response.data.data.reports || [];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        
        if (err.response?.status === 401) {
          setError(t("loginAgainToView"));
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError(t("noComplaintsFound"));
        } else {
          setError(err.response?.data?.message || t("failedToLoadComplaints"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [userId, navigate, t]);

  useEffect(() => {
    let filtered = complaints;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.reportId.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query)
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, selectedStatus, searchQuery]);

  const getStatusConfig = (status) => {
    const configs = {
      "resolved": { 
        icon: CheckCircle, 
        bg: "bg-emerald-500/10", 
        text: "text-emerald-400",
        border: "border-emerald-500/20"
      },
      "in-progress": { 
        icon: Clock, 
        bg: "bg-blue-500/10", 
        text: "text-blue-400",
        border: "border-blue-500/20"
      },
      "acknowledged": { 
        icon: AlertTriangle, 
        bg: "bg-amber-500/10", 
        text: "text-amber-400",
        border: "border-amber-500/20"
      },
      "pending": { 
        icon: Clock, 
        bg: "bg-orange-500/10", 
        text: "text-orange-400",
        border: "border-orange-500/20"
      },
      "rejected": { 
        icon: XCircle, 
        bg: "bg-red-500/10", 
        text: "text-red-400",
        border: "border-red-500/20"
      }
    };
    return configs[status] || configs["pending"];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDetailDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCount = (status) => {
    return complaints.filter(c => c.status === status).length;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
      />
    ));
  };

  const getLatestUpdate = (updates) => {
    if (!updates || updates.length === 0) {
      return { message: t("noUpdatesAvailable"), date: null };
    }
    return updates[updates.length - 1];
  };

  const toggleComplaintDetails = (complaint) => {
    setSelectedComplaint(selectedComplaint?.reportId === complaint.reportId ? null : complaint);
  };

  const openDetailModal = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/userloginbg6.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 w-full z-50  backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <motion.button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t("back")}
          </motion.button>
          
          <motion.div 
            className="text-xl md:text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("trackYourComplaints")}
          </motion.div>
          
          <div className="w-10"></div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-4 relative z-10 mt-16">
        <motion.div 
          className="w-full max-w-4xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{t("yourComplaints")}</h1>
              <p className="text-white/60 text-sm mt-1">{complaints.length} {t("totalComplaints")}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {[
              { label: t("total"), count: complaints.length, status: "all" },
              { label: t("pending"), count: getStatusCount("pending"), status: "pending" },
              { label: t("inProgress"), count: getStatusCount("in-progress"), status: "in-progress" },
              { label: t("resolved"), count: getStatusCount("resolved"), status: "resolved" }
            ].map((stat, index) => (
              <motion.button
                key={stat.label}
                onClick={() => setSelectedStatus(stat.status)}
                className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                  selectedStatus === stat.status 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-2xl font-bold text-white">{stat.count}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchComplaintsPlaceholder")}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none transition-all duration-200 placeholder:text-white/60"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
          </div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-200 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <XCircle className="h-6 w-6 mx-auto mb-2" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 text-white/60">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>{t("loadingYourComplaints")}</p>
            </div>
          )}

          {/* Complaints List */}
          {!loading && !error && (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, index) => {
                    const statusConfig = getStatusConfig(complaint.status);
                    const StatusIcon = statusConfig.icon;
                    const isSelected = selectedComplaint?.reportId === complaint.reportId;
                    
                    return (
                      <motion.div
                        key={complaint._id || complaint.reportId}
                        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05
                        }}
                        layout
                      >
                        {/* Complaint Card */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-white/10 transition-all duration-200"
                          onClick={() => toggleComplaintDetails(complaint)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                              <p className="text-white/60 text-sm">{t("id")}: {complaint.reportId} • {formatDate(complaint.createdAt || complaint.date)}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                                <StatusIcon size={14} />
                                <span className="capitalize">{t(complaint.status.replace('-', ' '))}</span>
                              </div>
                              {isSelected ? <ChevronUp size={20} className="text-white/60" /> : <ChevronDown size={20} className="text-white/60" />}
                            </div>
                          </div>
                          
                          <p className="text-white/80 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                          
                          {/* Location & Stats */}
                          <div className="flex justify-between items-center text-xs text-white/60">
                            {complaint.location?.address && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="truncate max-w-xs">{complaint.location.address}</span>
                              </span>
                            )}
                            
                            <div className="flex items-center gap-3">
                              <span>👍 {complaint.upvoteCount || 0}</span>
                              <span>{t("priority")}: {complaint.priority || 1}/5</span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="border-t border-white/10"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="p-6 bg-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Left Column */}
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-white/80 mb-2">{t("fullDescription")}</h4>
                                      <p className="text-white/90 text-sm leading-relaxed">{complaint.description}</p>
                                    </div>
                                    
                                    {complaint.location?.address && (
                                      <div>
                                        <h4 className="text-sm font-medium text-white/80 mb-2">{t("location")}</h4>
                                        <div className="flex items-center gap-2 text-white/90">
                                          <MapPin size={14} />
                                          <span>{complaint.location.address}</span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Municipality & Department */}
                                    {(complaint.municipality?.name || complaint.department?.name) && (
                                      <div>
                                        <h4 className="text-sm font-medium text-white/80 mb-2">{t("assignment")}</h4>
                                        <div className="space-y-1">
                                          {complaint.municipality?.name && (
                                            <div className="flex items-center gap-2 text-white/90">
                                              <Building size={14} />
                                              <span>{complaint.municipality.name}</span>
                                            </div>
                                          )}
                                          {complaint.department?.name && (
                                            <div className="flex items-center gap-2 text-white/90">
                                              <User size={14} />
                                              <span>{complaint.department.name}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Column */}
                                  <div className="space-y-4">
                                    {/* Timeline */}
                                    {complaint.updates && complaint.updates.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-medium text-white/80 mb-3">{t("progressTimeline")}</h4>
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                          {complaint.updates.map((update, updateIndex) => (
                                            <div key={updateIndex} className="flex gap-3">
                                              <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                {updateIndex < complaint.updates.length - 1 && (
                                                  <div className="w-0.5 h-8 bg-blue-400/30 mt-1"></div>
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-white/90 text-sm">{update.message}</p>
                                                <p className="text-white/50 text-xs mt-1">{formatDate(update.date)}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Rating & Feedback */}
                                    {(complaint.rating || complaint.feedback) && (
                                      <div>
                                        <h4 className="text-sm font-medium text-white/80 mb-2">{t("yourFeedback")}</h4>
                                        {complaint.rating && (
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                              {renderStars(complaint.rating)}
                                            </div>
                                            <span className="text-white/80 text-sm">{complaint.rating}/5</span>
                                          </div>
                                        )}
                                        {complaint.feedback && (
                                          <p className="text-white/80 text-sm italic">"{complaint.feedback}"</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* View Full Details Button */}
                                <div className="mt-6 pt-6 border-t border-white/20">
                                  <button
                                    onClick={() => openDetailModal(complaint)}
                                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
                                  >
                                    {t("viewFullDetails")}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    className="text-center py-8 text-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    {searchQuery || selectedStatus !== "all" ? (
                      <div>
                        <p className="mb-4">{t("noComplaintsMatchingFilters")}</p>
                        <button 
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedStatus("all");
                          }}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {t("clearFilters")}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-6">{t("noComplaintsSubmittedYet")}</p>
                        <motion.button
                          onClick={() => navigate(`/user/${userId}/raise`)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t("submitFirstComplaint")}
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {detailModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedComplaint.title}</h2>
                <button 
                  onClick={() => setDetailModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-white/80">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{t("reported")}: {formatDetailDate(selectedComplaint.createdAt || selectedComplaint.date)}</span>
                </div>
                {selectedComplaint.status === "resolved" && (
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    <span>{t("resolved")}: {formatDetailDate(selectedComplaint.resolvedDate || selectedComplaint.updatedAt)}</span>
                  </div>
                )}
                <div className="flex items-center text-white/80">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedComplaint.location?.address || t('locationNotSpecified')}</span>
                </div>
                <div className="flex items-center text-white/80">
                  <span>{t("category")}: {selectedComplaint.category}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{t("description")}</h3>
                <p className="text-white/80">{selectedComplaint.description}</p>
              </div>
              
              {/* Progress Timeline */}
              {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{t("progressTimeline")}</h3>
                  <div className="space-y-4">
                    {selectedComplaint.updates.map((update, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                          {index < selectedComplaint.updates.length - 1 && (
                            <div className="w-0.5 h-12 bg-indigo-400/30 mt-1"></div>
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-white font-medium">{update.message}</p>
                          <p className="text-white/60 text-sm">{formatDetailDate(update.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Feedback Section */}
              {(selectedComplaint.rating || selectedComplaint.feedback) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{t("yourFeedback")}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(selectedComplaint.rating || 0)}
                    </div>
                    <span className="text-white/80">{selectedComplaint.rating || 0}/5</span>
                  </div>
                  {selectedComplaint.feedback && (
                    <p className="text-white/80 italic">"{selectedComplaint.feedback}"</p>
                  )}
                </div>
              )}

              {/* Municipality & Department Info */}
              {(selectedComplaint.municipality?.name || selectedComplaint.department?.name) && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedComplaint.municipality?.name && (
                      <div>
                        <span className="text-white/60">{t("municipality")}: </span>
                        <span className="text-white">{selectedComplaint.municipality.name}</span>
                      </div>
                    )}
                    {selectedComplaint.department?.name && (
                      <div>
                        <span className="text-white/60">{t("department")}: </span>
                        <span className="text-white">{selectedComplaint.department.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}