import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Star, Calendar, MapPin, Loader, XCircle } from "lucide-react";
import { getUserReports } from '../api/report';
import { useTranslation } from "react-i18next"; // Add this import

export default function ResolvedComplaints() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation(); // Add this hook
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch resolved complaints from backend
  useEffect(() => {
    const fetchResolvedComplaints = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await getUserReports({
          status: 'resolved',
          page: 1,
          limit: 50
        });
        
        console.log('Fetched resolved complaints:', response.data);
        
        const resolvedData = response.data.data.reports || [];
        setResolvedComplaints(resolvedData);
        
      } catch (err) {
        console.error('Error fetching resolved complaints:', err);
        
        if (err.response?.status === 401) {
          setError(t("loginAgainToView"));
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError(t("noResolvedComplaints"));
        } else {
          setError(err.response?.data?.message || t("failedToLoadResolved"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedComplaints();
  }, [userId, navigate, t]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLatestUpdate = (updates) => {
    if (!updates || updates.length === 0) {
      return { message: t("noUpdatesAvailable"), date: null };
    }
    return updates[updates.length - 1];
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background matching the login page exactly */}
      <div className="absolute inset-0 z-0">
        <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/userloginbg6.jpg')` }}
></div>
        {/* Exact same glassmorphism overlay as login page */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
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
            {t("resolvedComplaints")}
          </motion.div>
          
          <div className="w-10"></div> {/* Spacer for balance */}
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{t("resolvedIssues")}</h1>
              <p className="text-white/60 text-sm mt-1">{resolvedComplaints.length} {t("resolvedComplaintsCount")}</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 text-white/60">
              <Loader className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>{t("loadingResolvedComplaints")}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-red-300 text-lg">{error}</p>
            </div>
          )}

          {/* Complaints List */}
          {!loading && !error && (
            <>
              {resolvedComplaints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resolvedComplaints.map((complaint, index) => (
                    <motion.div 
                      key={complaint._id || complaint.reportId}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          {t("resolved")}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-white/60 text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{t("resolvedOn")} {formatDate(complaint.resolvedDate || complaint.updatedAt)}</span>
                      </div>
                      
                      <div className="flex items-center text-white/60 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{complaint.location?.address || t('locationNotSpecified')}</span>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                      
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(complaint.rating || 0)}
                        </div>
                        <span className="text-white/60 text-sm">{complaint.rating || 0}/5</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("noResolvedComplaintsYet")}</p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Complaint Detail Modal */}
        <AnimatePresence>
          {selectedComplaint && (
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
                    onClick={() => setSelectedComplaint(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-white/80">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{t("reported")}: {formatDate(selectedComplaint.createdAt || selectedComplaint.date)}</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    <span>{t("resolved")}: {formatDate(selectedComplaint.resolvedDate || selectedComplaint.updatedAt)}</span>
                  </div>
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
                
                {/* Resolution Timeline */}
                {selectedComplaint.updates && selectedComplaint.updates.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{t("resolutionTimeline")}</h3>
                    <div className="space-y-3">
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
                            <p className="text-white/60 text-sm">{formatDate(update.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Feedback Section */}
                {(selectedComplaint.rating || selectedComplaint.feedback) && (
                  <div>
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
    </div>
  );
}