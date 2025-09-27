import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Clock, CheckCircle, XCircle, AlertTriangle, 
  FileText, Calendar, MapPin, Building, User, Loader2, Plus, Star,
  ChevronDown, ChevronUp, Camera, Mic, Volume2, Download, Maximize2
} from "lucide-react";
import { getUserReports } from '../api/report';
import { useTranslation } from "react-i18next";

// Debug logging utility
const debugLog = (message, data = null, type = 'info') => {
  const timestamp = new Date().toISOString();
  const env = import.meta.env.MODE || 'development';
  const logMessage = `[${timestamp}] [${env.toUpperCase()}] [TRACK-COMPLAINT] ${message}`;
  
  if (data) {
    console[type](logMessage, data);
  } else {
    console[type](logMessage);
  }
};

// **Fixed Image Modal Component with Higher Z-Index**
const ImageModal = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }} 
    >
      <motion.div 
        className="relative max-w-4xl max-h-[90vh] w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white text-xl z-10"
        >
          ✕
        </button>
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-contain rounded-lg"
          onClick={onClose}
        />
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <p className="text-white text-sm">{title}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function TrackComplaint() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // Image modal state
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', title: '' });

  // Enhanced debug function for API calls
  const debugApiCall = async (apiFunction, functionName, params = {}) => {
    debugLog(`🚀 API Call Started: ${functionName}`, {
      userId,
      params,
      timestamp: new Date().toISOString()
    });

    try {
      // Check token first
      const token = localStorage.getItem('accessToken');
      debugLog('🔐 Token Check', {
        exists: !!token,
        length: token?.length,
        preview: token ? `${token.substring(0, 20)}...` : 'none'
      });

      if (!token) {
        throw new Error('NO_TOKEN');
      }

      // Validate token format
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT token format');
        }
        debugLog('✅ Token format valid');
      } catch (tokenError) {
        debugLog('❌ Invalid token format', { error: tokenError.message });
        localStorage.removeItem('accessToken');
        throw new Error('INVALID_TOKEN_FORMAT');
      }

      // Make API call
      debugLog(`📡 Making API request to ${functionName}`, {
        baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8000',
        endpoint: '/api/v1/reports/user/me',
        params
      });

      const response = await apiFunction(params);
      
      debugLog(`✅ API Response Success: ${functionName}`, {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'none'
      });

      return response;

    } catch (error) {
      debugLog(`💥 API Call Failed: ${functionName}`, {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          params: error.config?.params
        }
      }, 'error');

      throw error;
    }
  };

  // Enhanced fetch function with comprehensive debugging
  const fetchUserComplaints = async () => {
    debugLog('🔍 fetchUserComplaints STARTED', {
      userId,
      component: 'TrackComplaint',
      timestamp: new Date().toISOString()
    });

    setLoading(true);
    setError("");
    
    try {
      // Check environment and connectivity first
      debugLog('🌍 Environment Check', {
        mode: import.meta.env.MODE,
        baseURL: import.meta.env.VITE_BASE_URL,
        nodeEnv: process.env.NODE_ENV
      });

      // Test backend connectivity
      try {
        const healthResponse = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}/health`);
        debugLog('🏥 Backend Health Check', {
          status: healthResponse.status,
          ok: healthResponse.ok
        });
        
        if (!healthResponse.ok) {
          throw new Error(`Backend health check failed: ${healthResponse.status}`);
        }
      } catch (healthError) {
        debugLog('❌ Backend connectivity issue', {
          error: healthError.message,
          url: import.meta.env.VITE_BASE_URL || 'http://localhost:8000'
        }, 'warn');
      }

      const response = await debugApiCall(getUserReports, 'getUserReports', { page: 1, limit: 50 });
      
      debugLog('📊 Processing API Response', {
        responseStructure: {
          data: !!response.data,
          dataData: !!response.data?.data,
          reports: !!response.data?.data?.reports
        }
      });

      if (response.data && response.data.success) {
        const complaintsData = response.data.data?.reports || [];
        
        debugLog('✅ Complaints data received', {
          count: complaintsData.length,
          sample: complaintsData.length > 0 ? {
            firstId: complaintsData[0].reportId,
            firstTitle: complaintsData[0].title,
            firstStatus: complaintsData[0].status
          } : 'no complaints'
        });

        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        
        debugLog('✅ Complaints state updated successfully');

      } else {
        debugLog('❌ Invalid response format', {
          response: response.data,
          expectedStructure: '{ success: true, data: { reports: [] } }'
        });
        throw new Error('INVALID_RESPONSE_FORMAT');
      }

    } catch (err) {
      debugLog('💥 Error in fetchUserComplaints', {
        errorName: err.name,
        errorMessage: err.message,
        errorCode: err.code,
        stack: err.stack
      }, 'error');

      // Handle specific error cases
      if (err.response?.status === 401) {
        const errorMsg = "Session expired. Please login again.";
        debugLog('🔐 Authentication error', { message: errorMsg });
        setError(errorMsg);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
        
      } else if (err.message === 'NO_TOKEN') {
        const errorMsg = "Please login to view your complaints.";
        debugLog('🔐 No token found', { message: errorMsg });
        setError(errorMsg);
        navigate('/login');
        
      } else if (err.message === 'INVALID_TOKEN_FORMAT') {
        const errorMsg = "Invalid session. Please login again.";
        debugLog('🔐 Invalid token format', { message: errorMsg });
        setError(errorMsg);
        navigate('/login');
        
      } else if (err.response?.status === 404) {
        const errorMsg = t("noComplaintsFound");
        debugLog('📭 No complaints found', { message: errorMsg });
        setError(errorMsg);
        
      } else if (err.response?.status === 500) {
        const errorMsg = "Server error. Please try again later.";
        debugLog('💥 Server 500 error', { 
          message: errorMsg,
          serverError: err.response?.data 
        });
        setError(errorMsg);
        
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
        const errorMsg = "Cannot connect to server. Please check your connection.";
        debugLog('🌐 Network error', { message: errorMsg });
        setError(errorMsg);
        
      } else {
        const errorMsg = err.response?.data?.message || err.message || t("failedToLoadComplaints");
        debugLog('❌ Generic error', { message: errorMsg });
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
      debugLog('⏹️ fetchUserComplaints COMPLETED', {
        loading: false,
        complaintsCount: complaints.length,
        error: error || 'none'
      });
    }
  };

  // Enhanced useEffect with debugging
  useEffect(() => {
    debugLog('🎯 TrackComplaint Component Mounted', {
      userId,
      path: window.location.pathname,
      search: window.location.search
    });

    fetchUserComplaints();

    // Cleanup function
    return () => {
      debugLog('🧹 TrackComplaint Component Unmounted');
    };
  }, [userId, navigate, t]);

  // Enhanced filtering useEffect
  useEffect(() => {
    debugLog('🔍 Filtering complaints', {
      totalComplaints: complaints.length,
      selectedStatus,
      searchQuery,
      searchQueryLength: searchQuery.length
    });

    let filtered = complaints;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(complaint => complaint.status === selectedStatus);
      debugLog('✅ Status filter applied', {
        status: selectedStatus,
        filteredCount: filtered.length
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.reportId.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query) ||
        (complaint.contentSummary && complaint.contentSummary.toLowerCase().includes(query))
      );
      debugLog('✅ Search filter applied', {
        query: searchQuery,
        filteredCount: filtered.length
      });
    }

    setFilteredComplaints(filtered);
    debugLog('📊 Filtering completed', {
      originalCount: complaints.length,
      filteredCount: filtered.length
    });
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
      },
      "pending_assignment": { 
        icon: Clock, 
        bg: "bg-purple-500/10", 
        text: "text-purple-400",
        border: "border-purple-500/20"
      }
    };
    return configs[status] || configs["pending"];
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      debugLog('❌ Date formatting error', { dateString, error: error.message }, 'warn');
      return 'Invalid Date';
    }
  };

  const formatDetailDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      debugLog('❌ Detailed date formatting error', { dateString, error: error.message }, 'warn');
      return 'Invalid Date';
    }
  };

  const getStatusCount = (status) => {
    const count = complaints.filter(c => c.status === status).length;
    debugLog('📈 Status count', { status, count });
    return count;
  };

  const renderStars = (rating) => {
    if (!rating || rating < 1 || rating > 5) {
      debugLog('⚠️ Invalid rating value', { rating }, 'warn');
      rating = 0;
    }
    
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
    debugLog('📋 Toggling complaint details', {
      complaintId: complaint.reportId,
      currentlySelected: selectedComplaint?.reportId,
      action: selectedComplaint?.reportId === complaint.reportId ? 'closing' : 'opening'
    });
    
    setSelectedComplaint(selectedComplaint?.reportId === complaint.reportId ? null : complaint);
  };

  const openDetailModal = (complaint) => {
    debugLog('🔍 Opening detail modal', { complaintId: complaint.reportId });
    setSelectedComplaint(complaint);
    setDetailModalOpen(true);
  };

  // Image modal functions with debugging
  const openImageModal = (imageUrl, title) => {
    debugLog('🖼️ Opening image modal', { imageUrl: imageUrl.substring(0, 50) + '...', title });
    setImageModal({ isOpen: true, imageUrl, title });
  };

  const closeImageModal = () => {
    debugLog('🖼️ Closing image modal');
    setImageModal({ isOpen: false, imageUrl: '', title: '' });
  };

  // Helper function to get content display
  const getContentDisplay = (complaint) => {
    let content = 'No description available';
    
    if (complaint.contentSummary) {
      content = complaint.contentSummary;
    } else if (complaint.description) {
      content = complaint.description;
    } else if (complaint.voiceMessage?.url) {
      content = '🎤 Voice Message';
    }
    
    debugLog('📝 Content display', { 
      complaintId: complaint.reportId,
      hasContentSummary: !!complaint.contentSummary,
      hasDescription: !!complaint.description,
      hasVoiceMessage: !!complaint.voiceMessage?.url,
      contentLength: content.length
    });
    
    return content;
  };

  // Helper function to format status for translation
  const formatStatusForTranslation = (status) => {
    const formatted = status.replace('-', '').replace('_', '');
    debugLog('🌐 Formatting status for translation', { original: status, formatted });
    return formatted;
  };

  // Debug component render
  debugLog('🎨 TrackComplaint Component Rendering', {
    loading,
    error: error || 'none',
    complaintsCount: complaints.length,
    filteredCount: filteredComplaints.length,
    selectedStatus,
    searchQueryLength: searchQuery.length
  });

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
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <motion.button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
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
              { label: t("pending"), count: getStatusCount("pending") + getStatusCount("pending_assignment"), status: "pending" },
              { label: t("inProgress"), count: getStatusCount("in-progress"), status: "in-progress" },
              { label: t("resolved"), count: getStatusCount("resolved"), status: "resolved" }
            ].map((stat, index) => (
              <motion.button
                key={stat.label}
                onClick={() => {
                  debugLog('📊 Status filter clicked', { status: stat.status });
                  setSelectedStatus(stat.status);
                }}
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
              onChange={(e) => {
                const newQuery = e.target.value;
                debugLog('🔍 Search query changed', { newQuery, length: newQuery.length });
                setSearchQuery(newQuery);
              }}
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
                <button 
                  onClick={() => {
                    debugLog('🔄 Retry button clicked');
                    fetchUserComplaints();
                  }}
                  className="mt-2 text-red-300 hover:text-red-100 underline text-sm"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8 text-white/60">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>{t("loadingYourComplaints")}</p>
              <p className="text-xs mt-2">{t("Fetchingyourcomplaintsfromtheserver")}...</p>
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
                    
                    debugLog('📋 Rendering complaint card', {
                      index,
                      complaintId: complaint.reportId,
                      title: complaint.title,
                      status: complaint.status,
                      isSelected
                    });
                    
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
                                <span className="capitalize">{t(formatStatusForTranslation(complaint.status))}</span>
                              </div>
                              {isSelected ? <ChevronUp size={20} className="text-white/60" /> : <ChevronDown size={20} className="text-white/60" />}
                            </div>
                          </div>
                          
                          <p className="text-white/80 text-sm mb-3 line-clamp-2">
                            {getContentDisplay(complaint)}
                          </p>
                          
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
                              {complaint.voiceMessage?.url && <span title="Has voice message">🎤</span>}
                              {(complaint.image?.url || complaint.media?.url) && <span title="Has photo">📷</span>}
                            </div>
                          </div>
                        </div>

                        {/* **IMPROVED: Expanded Details** */}
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
                                      <h4 className="text-sm font-medium text-white/80 mb-2">
                                        {complaint.voiceMessage?.url ? t("content") : t("fullDescription")}
                                      </h4>
                                      {complaint.description ? (
                                        <p className="text-white/90 text-sm leading-relaxed">{complaint.description}</p>
                                      ) : complaint.voiceMessage?.url ? (
                                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                                          <span className="text-blue-400">🎤</span>
                                          <span className="text-white/90 text-sm">Voice message recorded</span>
                                          {complaint.voiceMessage.transcription && (
                                            <span className="text-white/60 text-xs">({complaint.voiceMessage.transcription.substring(0, 50)}...)</span>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-white/60 text-sm italic">No description available</p>
                                      )}
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
                                    {/* **FIXED: Enhanced Timeline with Creation Entry** */}
                                    <div>
                                      <h4 className="text-sm font-medium text-white/80 mb-3">{t("progressTimeline")}</h4>
                                      <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {/* Creation entry - always show first */}
                                        <div className="flex gap-3">
                                          <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            {(complaint.updates && complaint.updates.length > 0) && (
                                              <div className="w-0.5 h-8 bg-blue-400/30 mt-1"></div>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-white/90 text-sm font-medium">Report Submitted</p>
                                            <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                                              <Calendar size={10} />
                                              {formatDate(complaint.createdAt || complaint.date)}
                                            </p>
                                          </div>
                                        </div>
                                        
                                        {/* Actual updates */}
                                        {complaint.updates && complaint.updates.map((update, updateIndex) => (
                                          <div key={updateIndex} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                              <div className={`w-2 h-2 rounded-full ${
                                                updateIndex === complaint.updates.length - 1 
                                                  ? complaint.status === 'resolved' 
                                                    ? 'bg-green-400' 
                                                    : 'bg-blue-400'
                                                  : 'bg-blue-400'
                                              }`}></div>
                                              {updateIndex < complaint.updates.length - 1 && (
                                                <div className="w-0.5 h-8 bg-blue-400/30 mt-1"></div>
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-white/90 text-sm">{update.message}</p>
                                              <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {formatDate(update.date)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                        
                                        {/* Show "No updates yet" if no updates */}
                                        {(!complaint.updates || complaint.updates.length === 0) && (
                                          <div className="text-center py-2">
                                            <p className="text-white/50 text-xs italic">No updates yet</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

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

                                    {/* Verification Info */}
                                    {complaint.verificationData && (
                                      <div>
                                        <h4 className="text-sm font-medium text-white/80 mb-2">Verification</h4>
                                        <div className="space-y-1 text-xs text-white/70">
                                          {complaint.verificationData.smartVerified && (
                                            <div>✅ Smart verified ({complaint.verificationData.smartScore}% score)</div>
                                          )}
                                          <div>📍 Distance: {complaint.verificationData.distanceFromUser?.toFixed(2)}km</div>
                                        </div>
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
                            debugLog('🧹 Clearing filters');
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
                          onClick={() => {
                            debugLog('📝 Navigating to raise complaint page');
                            navigate(`/user/${userId}/raise`);
                          }}
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

      {/* **FIXED: Image Modal with Higher Z-Index** */}
      <AnimatePresence>
        {imageModal.isOpen && (
          <ImageModal 
            isOpen={imageModal.isOpen}
            onClose={closeImageModal}
            imageUrl={imageModal.imageUrl}
            title={imageModal.title}
          />
        )}
      </AnimatePresence>

      {/* Detail Modal */}
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
                  onClick={() => {
                    debugLog('❌ Closing detail modal');
                    setDetailModalOpen(false);
                  }}
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
              
              {/* Enhanced description section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedComplaint.voiceMessage?.url ? t("content") : t("description")}
                </h3>
                {selectedComplaint.description ? (
                  <p className="text-white/80">{selectedComplaint.description}</p>
                ) : selectedComplaint.voiceMessage?.url ? (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="h-5 w-5 text-blue-400" />
                      <span className="text-white/80">Voice message recorded</span>
                    </div>
                    <audio 
                      controls 
                      src={selectedComplaint.voiceMessage.url}
                      className="w-full"
                      style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                    {selectedComplaint.voiceMessage.transcription && (
                      <p className="text-white/60 text-sm mt-2">{selectedComplaint.voiceMessage.transcription}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white/60 italic">No description available</p>
                )}
              </div>

              {/* Media in Detail Modal */}
              {(selectedComplaint.image?.url || selectedComplaint.media?.url) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Photo Evidence</h3>
                  <img 
                    src={selectedComplaint.image?.url || selectedComplaint.media?.url} 
                    alt="Complaint evidence" 
                    className="w-full max-w-md rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openImageModal(selectedComplaint.image?.url || selectedComplaint.media?.url, selectedComplaint.title)}
                  />
                </div>
              )}
              
              {/* **FIXED: Progress Timeline in Detail Modal** */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t("progressTimeline")}</h3>
                <div className="space-y-4">
                  {/* Creation entry */}
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      {(selectedComplaint.updates && selectedComplaint.updates.length > 0) && (
                        <div className="w-0.5 h-12 bg-indigo-400/30 mt-1"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-white font-medium">Report Submitted</p>
                      <p className="text-white/60 text-sm">{formatDetailDate(selectedComplaint.createdAt || selectedComplaint.date)}</p>
                    </div>
                  </div>
                  
                  {/* Updates */}
                  {selectedComplaint.updates && selectedComplaint.updates.map((update, index) => (
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
                  
                  {/* No updates message */}
                  {(!selectedComplaint.updates || selectedComplaint.updates.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-white/50 text-sm italic">No updates yet</p>
                    </div>
                  )}
                </div>
              </div>
              
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