import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Download, RefreshCw, Users, MapPin, 
  Plus, FileText, AlertTriangle, BarChart3,
  ArrowLeft
} from 'lucide-react';

// Custom hooks
import { useDashboardData } from '../hooks/useDashboardData';

// Components
import ProfileDropdown from './ProfileDropdown';
import SummaryCards from './SummaryCards';
import FilterBar from './FilterBar';
import ComplaintCard from './ComplaintCard';
import ComplaintDetailView from './ComplaintDetailView';
import DepartmentManagementModal from './DepartmentManagementModal';
import PerformanceAnalyticsModal from './PerformanceAnalyticsModal';

// Utils
import { convertToCSV, downloadCSV } from '../utils/helpers';
import Pagination from '../Pagination';
import ScrollHeatmap from '../../pages/ScrollHeatmap';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [visibleComplaints, setVisibleComplaints] = useState(5);
  const [selectedAnalyticsCategory, setSelectedAnalyticsCategory] = useState('all');
  
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all',
    sort: 'date_desc',
    search: '',
    page: 1,
    limit: 20
  });

  // Use custom hook for data management
  const {
    complaints,
    loading,
    error,
    stats,
    user,
    categories,
    municipalities,
    departments,
    staffMembers,
    pagination,
    handleStatusUpdate,
    handleAssignToDepartment,
    handleUnassignFromDepartment,
    handleAddComment,
    handleDepartmentCreate,
    handleDepartmentUpdate,
    refreshData
  } = useDashboardData(filters);

  const handleLogout = async () => {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setVisibleComplaints(5);
  }, []);

  // Filter and paginate complaints
  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(c => {
        const complaintCategory = c.category || '';
        return complaintCategory.toLowerCase() === filters.category.toLowerCase() ||
               complaintCategory === filters.category;
      });
    }
    
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(c => {
        const priority = c.priority || c.urgency;
        return String(priority) === String(filters.priority);
      });
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        (c.title && c.title.toLowerCase().includes(searchLower)) ||
        (c.description && c.description.toLowerCase().includes(searchLower)) ||
        (c.area && c.area.toLowerCase().includes(searchLower)) ||
        (c.municipality?.name && c.municipality.name.toLowerCase().includes(searchLower)) ||
        (c.location?.address && c.location.address.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.sort === 'date_desc') {
      filtered.sort((a, b) => new Date(b.date || b.submittedAt) - new Date(a.date || a.submittedAt));
    } else if (filters.sort === 'date_asc') {
      filtered.sort((a, b) => new Date(a.date || a.submittedAt) - new Date(b.date || b.submittedAt));
    } else if (filters.sort === 'priority_desc') {
      filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    
    return filtered;
  }, [complaints, filters]);

  const handleExport = () => {
    try {
      const dataToExport = filteredComplaints;
      const csvContent = convertToCSV(dataToExport);
      downloadCSV(csvContent, `admin-reports-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getAnalyticsData = () => {
    if (selectedAnalyticsCategory === 'all') {
      return {
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      };
    }
    
    const filtered = complaints.filter(c => c.category === selectedAnalyticsCategory);
    return {
      pending: filtered.filter(c => c.status === 'pending').length,
      inProgress: filtered.filter(c => c.status === 'in-progress').length,
      resolved: filtered.filter(c => c.status === 'resolved').length
    };
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}images/userloginbg8.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        {currentView === 'dashboard' ? (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8 flex justify-between items-center max-w-6xl mx-auto">
              <div>
                <motion.h1 
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Admin Dashboard
                </motion.h1>
                <motion.p 
                  className="text-white/70 text-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Manage complaints and monitor municipal services
                </motion.p>
              </div>
              
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => setShowDepartmentModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Manage Departments
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </motion.div>
            </div>

            {/* Summary Cards */}
            <SummaryCards stats={stats} />

            {/* Filter Bar */}
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              categories={categories}
              municipalities={municipalities}
            />

            {/* Analytics Section */}
<motion.div 
  className="bg-gradient-to-br backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6 max-w-4xl mx-auto shadow-2xl"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  {/* Header with Gradient */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <div className="p-2 bg-indigo-500/20 rounded-xl">
          <BarChart3 className="h-6 w-6 text-indigo-400" />
        </div>
        <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text">
          Performance Analytics
        </span>
      </h2>
      <p className="text-white/50 text-sm mt-1">Real-time overview of complaint status</p>
    </div>
    
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowAnalyticsModal(true)}
      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center gap-2 font-medium"
    >
      <BarChart3 className="h-4 w-4" />
      Detailed Analytics
    </motion.button>
  </div>
  
  {/* Enhanced Category Selection */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
      <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
      Choose Category
    </label>
    <div className="relative">
      <select
        value={selectedAnalyticsCategory}
        onChange={(e) => setSelectedAnalyticsCategory(e.target.value)}
        className="w-full max-w-xs px-4 py-3 border-white/20 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:bg-white/10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' strokeOpacity='0.5'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '1.5rem',
        }}
      >
        <option value="all" className="bg-gray-800">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category} className="bg-gray-800">
            {category}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Enhanced Analytics Graph with Cards */}
  <div className="space-y-6">
    {/* Status Overview Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></span>
        {selectedAnalyticsCategory === 'all' ? 'Overall Performance' : `${selectedAnalyticsCategory} Performance`}
      </h3>
      
      {/* Mini Legend */}
      <div className="flex gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-white/50">Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-white/50">In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/50">Resolved</span>
        </div>
      </div>
    </div>

    {/* Enhanced Progress Bars */}
    <div className="p-5 ">
      {(() => {
        const data = getAnalyticsData();
        const maxValue = Math.max(data.pending, data.inProgress, data.resolved) || 1;
        const total = data.pending + data.inProgress + data.resolved;
        
        const items = [
          { label: 'Pending', value: data.pending, color: 'from-red-500 to-red-400', bg: 'bg-red-500/20', icon: '⏳' },
          { label: 'In Progress', value: data.inProgress, color: 'from-yellow-500 to-yellow-400', bg: 'bg-yellow-500/20', icon: '🔄' },
          { label: 'Resolved', value: data.resolved, color: 'from-green-500 to-green-400', bg: 'bg-green-500/20', icon: '✅' },
        ];

        return items.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          
          return (
            <motion.div 
              key={item.label}
              className="mb-4 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-white/80">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{item.value}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden group">
                {/* Animated progress bar */}
                <motion.div 
                  className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
                </motion.div>
                
                {/* Hover tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.value} complaints
                </div>
              </div>
            </motion.div>
          );
        });
      })()}
    </div>
  </div>

  {/* Add animation keyframes */}
  <style jsx>{`
    @keyframes shine {
      0% {
        transform: translateX(-100%) skewX(-12deg);
      }
      100% {
        transform: translateX(200%) skewX(-12deg);
      }
    }
    .animate-shine {
      animation: shine 2s infinite;
    }
  `}</style>
</motion.div>

            {/* Complaints List */}
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl ml-30 font-bold text-white ">Recent Complaints</h2>
                <div className="flex gap-2 mr-30">
                  <button
                    onClick={() => setCurrentView('map')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Map View
                  </button>
                  <button 
                    onClick={refreshData}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    className="flex justify-center items-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 text-white animate-spin mb-4" />
                      <p className="text-white/70">Loading complaints data...</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    key="error"
                    className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h3>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button 
                      onClick={refreshData}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : filteredComplaints.length === 0 ? (
                  <motion.div 
                    key="empty"
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white/70 mb-2">No Complaints Found</h3>
                    <p className="text-white/50">Try adjusting your filters or check back later.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredComplaints.slice(0, visibleComplaints).map((complaint, index) => (
                      <ComplaintCard
                        key={complaint._id}
                        complaint={complaint}
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setCurrentView('detail');
                        }}
                        index={index}
                      />
                    ))}
                    
                    {visibleComplaints < filteredComplaints.length && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setVisibleComplaints(prev => Math.min(prev + 5, filteredComplaints.length))}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Load More ({filteredComplaints.length - visibleComplaints} remaining)
                        </button>
                      </div>
                    )}
                    
                    {pagination.totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                          showFirstLast={true}
                          className="bg-white/10 backdrop-blur-xl border-white/20"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : currentView === 'detail' && selectedComplaint ? (
          <ComplaintDetailView 
            complaint={selectedComplaint}
            onBack={() => setCurrentView('dashboard')}
            onStatusUpdate={handleStatusUpdate}
            departments={departments}
            onAssign={handleAssignToDepartment}
            onUnassign={handleUnassignFromDepartment}
            isAssigning={isAssigning}
            onAddComment={handleAddComment}
          />
        ) : currentView === 'map' ? (
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-white">Complaints Map View</h1>
            </div>
            
            <div className="w-full flex justify-center items-center text-center mt-6">
              <h1 className="text-[5vw] md:text-[3vw] font-bold text-white">
                Live Complaints Heatmap
              </h1>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden mt-4">
              <div style={{
                background: "#081025",
                color: "#e6eef8",
                padding: 0,
              }}>
                <ScrollHeatmap />
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
      
      {/* Modals */}
      <DepartmentManagementModal
        isOpen={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        departments={departments}
        onDepartmentCreate={handleDepartmentCreate}
        onDepartmentUpdate={handleDepartmentUpdate}
        staffMembers={staffMembers}
      />

      <PerformanceAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        departments={departments}
        complaints={complaints}
        categories={categories}
      />
    </div>
  );
};

export default AdminDashboard;