import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  RefreshCw,
  MoreHorizontal,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  MessageSquare,
  ThumbsUp,
  ArrowBigUp,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  Send,
  Edit3,
  Calendar,
  Eye,
  Paperclip
} from 'lucide-react';

import GoogleMapView from './GoogleMapView';

// Import your existing API functions
import { 
  getAllReports, 
  getReportsAnalytics, 
  updateReportStatus,
  getReportById
} from '../api/report';
import { getCurrentUser } from '../api/auth';
import { getAllDepartments } from '../api/department';
import { getAllMunicipalities } from '../api/municipality';
import Pagination from './Pagination';
// Fallback data generator for when APIs are not available
const generateFallbackComplaintData = () => {
  const statuses = ['pending', 'acknowledged', 'in-progress', 'resolved', 'rejected'];
  const categories = ['Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution'];
  const areas = ['Downtown', 'Suburbia', 'West End'];
  const priorities = [5, 4, 3, 2, 1];
  
  const complaints = [];
  
  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const submittedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    
    complaints.push({
      _id: `fallback_${i}`,
      reportId: `REPORT_${i}`,
      title: `${category} issue #${i} in ${area}`,
      description: `This is a detailed description of report #${i}. The issue relates to ${category.toLowerCase()} and needs attention in the ${area} area. Residents have reported multiple instances of this problem occurring over the past few weeks.`,
      category,
      status,
      area,
      priority,
      date: submittedDate.toISOString(),
      upvoteCount: Math.floor(Math.random() * 50),
      upvotes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
      submittedAt: submittedDate.toISOString(),
      urgency: priority === 5 ? 'high' : priority >= 3 ? 'medium' : 'low',
      submissionsCount: Math.floor(Math.random() * 5) + 1,
      media: {
        url: `https://picsum.photos/600/400?random=${i}`,
        id: `${i}-1`
      },
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} ${area} Street`,
        coordinates: [40.7128 + (Math.random() - 0.5) * 0.01, -74.0060 + (Math.random() - 0.5) * 0.01]
      },
      municipality: {
        name: area
      },
      department: status !== 'pending' ? {
        name: `${category} Department`
      } : null,
      reportedBy: {
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        avatar: `https://ui-avatars.com/api/?name=Reporter+${i}&background=3b82f6&color=fff`
      },
      updates: [
        {
          date: submittedDate.toISOString(),
          message: 'Report submitted by citizen',
          updatedBy: { name: `Reporter ${i}` }
        },
        ...(status !== 'pending' ? [{
          date: new Date(submittedDate.getTime() + Math.random() * 86400000).toISOString(),
          message: `Report forwarded to ${category} department`,
          updatedBy: { name: 'Admin User' }
        }] : []),
        ...(status === 'resolved' ? [{
          date: new Date(submittedDate.getTime() + Math.random() * 86400000 * 2).toISOString(),
          message: 'Issue has been successfully resolved',
          updatedBy: { name: 'Department Lead' }
        }] : [])
      ]
    });
  }
  
  return complaints;
};

const extractCoordinates = (location) => {
  if (!location) return null;
  
  // Check for coordinates array
  if (location.coordinates && Array.isArray(location.coordinates)) {
    return location.coordinates;
  }
  
  // Check for lat/lng object
  if (location.lat && location.lng) {
    return [location.lat, location.lng];
  }
  
  // Check for latitude/longitude properties
  if (location.latitude && location.longitude) {
    return [location.latitude, location.longitude];
  }
  
  // Check for coords array
  if (location.coords && Array.isArray(location.coords)) {
    return location.coords;
  }
  
  return null;
};

// Generate stats based on complaints
const generateStatsFromComplaints = (complaints) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const acknowledged = complaints.filter(c => c.status === 'acknowledged').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const rejected = complaints.filter(c => c.status === 'rejected').length;
  
  return { 
    totalReports: total, 
    pendingReports: pending, 
    acknowledgedReports: acknowledged,
    inProgressReports: inProgress, 
    resolvedReports: resolved, 
    rejectedReports: rejected 
  };
};

// Safe rendering utility to prevent object rendering errors
const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length;
    return fallback;
  }
  return value;
};

// Simple Info icon component
const Info = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// Complaint Card Component - FIXED to prevent object rendering
const ComplaintCard = ({ complaint, onClick, index }) => {
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    acknowledged: <AlertCircle className="h-5 w-5 text-blue-500" />,
    'in-progress': <RefreshCw className="h-5 w-5 text-blue-500" />,
    resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  const statusText = {
    pending: 'Pending',
    acknowledged: 'Acknowledged',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected'
  };
  
  const priorityIcons = {
    5: <AlertTriangle className="h-5 w-5 text-red-500" />,
    4: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    3: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    2: <Info className="h-5 w-5 text-blue-500" />,
    1: <Info className="h-5 w-5 text-green-500" />,
    high: <AlertTriangle className="h-5 w-5 text-red-500" />,
    medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    low: <Info className="h-5 w-5 text-blue-500" />
  };

  // Safe upvote count calculation
  const getUpvoteCount = () => {
    if (typeof complaint.upvoteCount === 'number') return complaint.upvoteCount;
    if (typeof complaint.upvotes === 'number') return complaint.upvotes;
    if (Array.isArray(complaint.upvotes)) return complaint.upvotes.length;
    return 0;
  };

  // Safe updates count calculation
  const getUpdatesCount = () => {
    if (typeof complaint.comments === 'number') return complaint.comments;
    if (Array.isArray(complaint.updates)) return complaint.updates.length;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 cursor-pointer hover:shadow-lg transition-all duration-300 mb-4 max-w-4xl mx-auto h-32 flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            {statusIcons[complaint.status]}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-lg mb-1">{safeRender(complaint.title, 'Untitled Report')}</h3>
            <p className="text-white/70 text-sm line-clamp-2">{safeRender(complaint.description, 'No description available')}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              {priorityIcons[complaint.priority] || priorityIcons[complaint.urgency]}
            </div>
            
            <div className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white">
              {safeRender(complaint.category, 'Unknown')}
            </div>
            
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              complaint.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
              complaint.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
              complaint.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
              complaint.status === 'acknowledged' ? 'bg-blue-500/20 text-blue-500' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>
              {statusText[complaint.status] || 'Unknown'}
            </span>
          </div>
          
          <span className="text-xs text-white/70">
            {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-white/60 text-sm mt-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{safeRender(complaint.area || complaint.municipality?.name, 'Unknown')}</span>
        </div>
        
        <div className="flex items-center">
          <ArrowBigUp className="h-4 w-4 mr-1" />
          <span>{getUpvoteCount()} upvotes</span>
        </div>
        
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{getUpdatesCount()} updates</span>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Bar Component
const FilterBar = ({ filters, onFilterChange, categories = [], municipalities = [] }) => {
  const statuses = ['all', 'pending', 'acknowledged', 'in-progress', 'resolved', 'rejected'];
  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: '5', label: 'Critical (5)' },
    { value: '4', label: 'High (4)' },
    { value: '3', label: 'Medium (3)' },
    { value: '2', label: 'Low (2)' },
    { value: '1', label: 'Very Low (1)' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6 relative z-20 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <input
            type="text"
            placeholder="Search reports..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full"
          >
            <span>{filters.category === 'all' ? 'All Categories' : filters.category}</span>
            {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-white/20 rounded-xl shadow-lg z-30">
              <button
                onClick={() => {
                  onFilterChange({ category: 'all' });
                  setIsCategoryOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                  filters.category === 'all' ? 'bg-white/20' : ''
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    onFilterChange({ category });
                    setIsCategoryOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                    filters.category === category ? 'bg-white/20' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full"
          >
            <span>{filters.status === 'all' ? 'All Statuses' : filters.status.replace('-', ' ')}</span>
            {isStatusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-white/20 rounded-xl shadow-lg z-30">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    onFilterChange({ status });
                    setIsStatusOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                    filters.status === status ? 'bg-white/20' : ''
                  }`}
                >
                  {status === 'all' ? 'All Statuses' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Priority Filter */}
        <div className="relative">
          <button
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full"
          >
            <span>
              {priorities.find(p => p.value === filters.priority)?.label || 'All Priorities'}
            </span>
            {isPriorityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {isPriorityOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-white/20 rounded-xl shadow-lg z-30">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  onClick={() => {
                    onFilterChange({ priority: priority.value });
                    setIsPriorityOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                    filters.priority === priority.value ? 'bg-white/20' : ''
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Summary Cards Component
const SummaryCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports || stats.total || 0,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Pending',
      value: stats.pendingReports || stats.pending || 0,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-500/20'
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports || stats.inProgress || 0,
      icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports || stats.resolved || 0,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      color: 'bg-green-500/20'
    },
    {
      title: 'Rejected',
      value: stats.rejectedReports || stats.rejected || 0,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-500/20'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 max-w-6xl mx-auto">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/70 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Detail View Components
const MediaGallery = ({ media }) => {
  if (!media || (!media.url && (!Array.isArray(media) || media.length === 0))) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
        <div className="text-white/60 italic">No media attached to this report</div>
      </div>
    );
  }

  const mediaArray = Array.isArray(media) ? media : [media];

  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mediaArray.map((item, index) => (
          <div key={item.id || index} className="relative group overflow-hidden rounded-xl">
            <img
              src={item.url}
              alt="Report media"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Eye className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Timeline Component - FIXED to prevent object rendering
const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-white/60 italic">No timeline events yet</div>;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'created': return <FileText className="h-4 w-4 text-blue-400" />;
      case 'assigned': return <User className="h-4 w-4 text-indigo-400" />;
      case 'progress': return <Clock className="h-4 w-4 text-amber-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white/10 border border-white/20">
              {getIcon(event.type)}
            </div>
            {index !== events.length - 1 && (
              <div className="w-0.5 h-8 bg-white/20 mt-1"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">{safeRender(event.title || event.message, 'Update')}</h3>
              <span className="text-sm text-white/60">
                {event.timestamp || event.date ? new Date(event.timestamp || event.date).toLocaleDateString() : 'No date'}
              </span>
            </div>
            <p className="text-white/70 text-sm mt-1">{safeRender(event.description || event.message, '')}</p>
            <div className="flex items-center mt-2 text-sm text-white/60">
              <User className="h-3 w-3 mr-1" />
              {safeRender(event.user || event.updatedBy?.name, 'System')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Rest of your AdminDashboard component remains exactly the same...
// Just continue with your existing code from the main component

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all',
    sort: 'date_desc',
    search: '',
    page: 1,
    limit: 20
  });

  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Rest of your existing AdminDashboard code...
  // Continue with your fetchData, event handlers, and render logic
  // The key fixes are in the ComplaintCard and Timeline components above

  // Fetch data from backend with fallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let reportsData = [];
      let analyticsData = {};
      let userData = null;
      let departmentsData = [];
      let municipalitiesData = [];

      // Try to fetch from backend APIs, fallback to mock data if they fail
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sort === 'date_desc' ? 'date' : filters.sort,
          sortOrder: filters.sort.includes('desc') ? 'desc' : 'asc'
        };

        if (filters.status !== 'all') params.status = filters.status;
        if (filters.category !== 'all') params.category = filters.category;
        if (filters.priority !== 'all') params.priority = filters.priority;
        if (filters.search) params.search = filters.search;

        const reportsResponse = await getAllReports(params);
        reportsData = reportsResponse.data.data.reports || reportsResponse.data.data || [];
        
        if (reportsResponse.data.data.totalPages) {
          setPagination({
            totalPages: reportsResponse.data.data.totalPages,
            currentPage: reportsResponse.data.data.currentPage,
            totalReports: reportsResponse.data.data.totalReports,
            hasNextPage: reportsResponse.data.data.hasNextPage,
            hasPrevPage: reportsResponse.data.data.hasPrevPage
          });
        }
      } catch (err) {
        console.warn('Reports API not available, using fallback data:', err.message);
        reportsData = generateFallbackComplaintData();
      }

      try {
        const analyticsResponse = await getReportsAnalytics();
        analyticsData = analyticsResponse.data.data.overview || analyticsResponse.data.data || {};
      } catch (err) {
        console.warn('Analytics API not available, generating from data:', err.message);
        analyticsData = generateStatsFromComplaints(reportsData);
      }

      try {
        const userResponse = await getCurrentUser();
        userData = userResponse.data.data || userResponse.data;
      } catch (err) {
        console.warn('User API not available:', err.message);
        userData = { name: 'Admin', email: 'admin@janconnect.com' };
      }

      try {
        const departmentsResponse = await getAllDepartments();
        departmentsData = departmentsResponse.data.data || departmentsResponse.data || [];
        if (Array.isArray(departmentsData)) {
          const deptCategories = departmentsData.map(d => d.name);
          setCategories(['Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution', ...deptCategories]);
        }
      } catch (err) {
        console.warn('Departments API not available:', err.message);
        setCategories(['Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution']);
      }

      try {
        const municipalitiesResponse = await getAllMunicipalities();
        municipalitiesData = municipalitiesResponse.data.data.municipalities || municipalitiesResponse.data.data || [];
        if (Array.isArray(municipalitiesData)) {
          const muniNames = municipalitiesData.map(m => m.name);
          setMunicipalities(muniNames);
        }
      } catch (err) {
        console.warn('Municipalities API not available:', err.message);
        setMunicipalities(['Downtown', 'Suburbia', 'West End']);
      }

      setComplaints(reportsData);
      setStats(analyticsData);
      setUser(userData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Using fallback data.');
      
      // Use fallback data in case of complete failure
      const fallbackData = generateFallbackComplaintData();
      setComplaints(fallbackData);
      setStats(generateStatsFromComplaints(fallbackData));
      setCategories(['Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution']);
      setMunicipalities(['Downtown', 'Suburbia', 'West End']);
      setUser({ name: 'Admin', email: 'admin@janconnect.com' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Continue with the rest of your existing code...
  // All the event handlers, filtering logic, and render logic remain the same

  // Filter and paginate complaints (for fallback data)
  const getFilteredComplaints = useCallback(() => {
    let filtered = [...complaints];
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(c => 
        c.priority?.toString() === filters.priority || 
        c.urgency === filters.priority
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm) || 
        c.description.toLowerCase().includes(searchTerm) ||
        (c.area && c.area.toLowerCase().includes(searchTerm)) ||
        (c.municipality?.name && c.municipality.name.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'date_desc':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'date_asc':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'upvotes_desc':
          filtered.sort((a, b) => (b.upvotes || b.upvoteCount || 0) - (a.upvotes || a.upvoteCount || 0));
          break;
        default:
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }
    
    return filtered;
  }, [complaints, filters]);

  const filteredComplaints = getFilteredComplaints();
  const displayedComplaints = filteredComplaints.slice(0, filters.page * filters.limit);
  const hasMore = displayedComplaints.length < filteredComplaints.length;

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleLoadMore = () => {
    if (hasMore || pagination.hasNextPage) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleComplaintClick = async (complaint) => {
    try {
      // Try to fetch detailed report data
      const response = await getReportById(complaint.reportId || complaint._id);
      setSelectedComplaint(response.data.data);
    } catch (error) {
      console.warn('Could not fetch detailed report, using basic data:', error.message);
      setSelectedComplaint(complaint);
    }
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedComplaint(null);
  };

  const handleExport = () => {
    try {
      const dataToExport = displayedComplaints.length > 0 ? displayedComplaints : complaints;
      const csvContent = convertToCSV(dataToExport);
      downloadCSV(csvContent, `admin-reports-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export functionality is not available at the moment.');
    }
  };

  const convertToCSV = (reports) => {
    const headers = [
      'Report ID', 'Title', 'Category', 'Status', 'Priority', 'Urgency',
      'Reporter', 'Municipality', 'Department', 'Date', 'Upvotes'
    ];

    const csvRows = [
      headers.join(','),
      ...reports.map(report => [
        report.reportId || report._id,
        `"${report.title}"`,
        report.category,
        report.status,
        report.priority,
        report.urgency,
        report.reportedBy?.name || 'Unknown',
        report.municipality?.name || report.area || 'Unknown',
        report.department?.name || 'Unassigned',
        new Date(report.date).toLocaleDateString(),
        report.upvoteCount || report.upvotes || 0
      ].join(','))
    ];

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleStatusUpdate = async (reportId, newStatus, message) => {
    try {
      await updateReportStatus(reportId, {
        status: newStatus,
        message: message || `Status updated to ${newStatus}`
      });
      
      // Refresh the reports
      fetchData();
      
      // Update selected complaint if it's the same one
      if (selectedComplaint && (selectedComplaint.reportId === reportId || selectedComplaint._id === reportId)) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
      
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update report status. This feature may not be available.');
    }
  };

  // Loading state
  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
        <div className="text-center relative z-10">
          <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Detail view
  if (currentView === 'detail' && selectedComplaint) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Header */}
          <motion.header
            className="flex items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBackToDashboard}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </motion.button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">{safeRender(selectedComplaint.title, 'Report Details')}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedComplaint.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    selectedComplaint.status === 'acknowledged' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    selectedComplaint.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    selectedComplaint.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedComplaint.status === 'pending' ? 'Pending' :
                     selectedComplaint.status === 'acknowledged' ? 'Acknowledged' :
                     selectedComplaint.status === 'in-progress' ? 'In Progress' :
                     selectedComplaint.status === 'resolved' ? 'Resolved' : 'Rejected'}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (selectedComplaint.urgency === 'low' || selectedComplaint.priority <= 2) ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    (selectedComplaint.urgency === 'medium' || selectedComplaint.priority === 3) ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedComplaint.urgency ? `${selectedComplaint.urgency} Priority` : `Priority ${selectedComplaint.priority}`}
                  </span>
                  
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                    {safeRender(selectedComplaint.category, 'Unknown')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-5 w-5 text-white" />
              </motion.button>
              
              <motion.button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </motion.header>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">ID</span>
              </div>
              <div className="text-white font-medium">{safeRender(selectedComplaint.reportId || `COMP-${String(selectedComplaint.id || selectedComplaint._id).slice(-3)}`, 'N/A')}</div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Submitted</span>
              </div>
              <div className="text-white font-medium">
                {selectedComplaint.submittedAt || selectedComplaint.date ? new Date(selectedComplaint.submittedAt || selectedComplaint.date).toLocaleDateString() : 'No date'}
              </div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <ArrowBigUp className="h-4 w-4" />
                <span className="text-sm">Upvotes</span>
              </div>
              <div className="text-white font-medium">{selectedComplaint.upvotes || selectedComplaint.upvoteCount || 0}</div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Updates</span>
              </div>
              <div className="text-white font-medium">{selectedComplaint.submissionsCount || selectedComplaint.updates?.length || 0}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Gallery */}
              <MediaGallery media={selectedComplaint.media} />
              
              {/* Description */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-white/80 leading-relaxed">{safeRender(selectedComplaint.description, 'No description available')}</p>
              </motion.div>
              
              {/* Location */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {selectedComplaint.location?.address || 
                    selectedComplaint.address ||
                    selectedComplaint.area || 
                    selectedComplaint.municipality?.name || 
                    'Location not specified'}
                  </span>
                </div>
                
                <GoogleMapView 
                  coordinates={extractCoordinates(selectedComplaint.location)}
                  address={selectedComplaint.location?.address || selectedComplaint.address}
                  title={safeRender(selectedComplaint.title, 'Report Location')}
                />
              </motion.div>

              {/* Timeline */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
                <Timeline events={selectedComplaint.timeline || selectedComplaint.updates} />
              </motion.div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Progress Editor */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Update Progress</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                    <select
                        style={{backgroundColor:"transparent"}}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      value={selectedComplaint.status}
                      onChange={(e) => handleStatusUpdate(selectedComplaint.reportId || selectedComplaint._id, e.target.value)}
                    >
                      <option style={{backgroundColor:"gray"}} value="pending">Pending</option>
                      <option style={{backgroundColor:"gray"}} value="acknowledged">Acknowledged</option>
                      <option style={{backgroundColor:"gray"}} value="in-progress">In Progress</option>
                      <option style={{backgroundColor:"gray"}} value="resolved">Resolved</option>
                      <option style={{backgroundColor:"gray"}} value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <button 
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => alert('Report status updated')}
                  >
                    <Edit3 className="h-4 w-4" />
                    Update Progress
                  </button>
                </div>
              </motion.div>
              
              {/* Assignment Panel */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Assignment</h2>
                  <button className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200">
                    {selectedComplaint.assignedTo ? 'Reassign' : 'Assign'}
                  </button>
                </div>

                {selectedComplaint.assignedTo ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <User className="h-5 w-5 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{safeRender(selectedComplaint.assignedTo.name, 'Assigned Team')}</h3>
                        <p className="text-sm text-white/70">{selectedComplaint.assignedTo.members?.length || 1} members</p>
                      </div>
                    </div>
                    
                    {selectedComplaint.assignedTo.members && (
                      <div className="space-y-3">
                        {selectedComplaint.assignedTo.members.map((member, index) => (
                          <div key={member.id || index} className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <User className="h-3 w-3 text-indigo-300" />
                            </div>
                            <span className="text-white/80">{safeRender(member.name, 'Team Member')}</span>
                            <span className="text-white/50">({safeRender(member.role, 'Member')})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedComplaint.department ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <User className="h-5 w-5 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{safeRender(selectedComplaint.department.name, 'Department')}</h3>
                        <p className="text-sm text-white/70">Department</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-white/60 italic">Not assigned yet</div>
                )}
              </motion.div>
              
              {/* User Info */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Reporter Information</h2>
                
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedComplaint.reporter?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedComplaint.reportedBy?.name || 'User')}&background=3b82f6&color=fff`}
                    alt={selectedComplaint.reporter?.name || selectedComplaint.reportedBy?.name || 'Reporter'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-white">{safeRender(selectedComplaint.reporter?.name || selectedComplaint.reportedBy?.name, 'Anonymous')}</h3>
                    <p className="text-sm text-white/70">Reporter</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">{safeRender(selectedComplaint.reporter?.email || selectedComplaint.reportedBy?.email, 'Not provided')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">{safeRender(selectedComplaint.reporter?.phone || selectedComplaint.reportedBy?.phone, 'Not provided')}</span>
                  </div>
                  
                  <button 
                    className="w-full mt-4 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => alert('Contact functionality is not available yet.')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Reporter
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <motion.header
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg max-w-6xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage citizen reports and ensure timely resolution</p>
            {error && <p className="text-yellow-400 text-sm mt-1">⚠️ Some features may be limited</p>}
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <motion.button
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </motion.button>
            
            <div className="flex items-center gap-2 p-2 bg-white/10 rounded-xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">{safeRender(user?.name, 'Admin')}</span>
            </div>
          </div>
        </motion.header>

        {/* Filter Bar */}
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          categories={categories}
          municipalities={municipalities}
        />

        {/* Summary Cards */}
        <SummaryCards stats={stats} />

        {/* Content */}
        <div className="mt-8">
          {displayedComplaints.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 max-w-md">
                <FileText className="h-12 w-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No reports found</h3>
                <p className="text-white/70 mb-6">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => handleFilterChange({ 
                    category: 'all', 
                    status: 'all',
                    priority: 'all',
                    search: '' 
                  })}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {displayedComplaints.map((complaint, index) => (
                    <ComplaintCard
                      key={complaint._id || complaint.id}
                      complaint={complaint}
                      onClick={() => handleComplaintClick(complaint)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {(hasMore || pagination.hasNextPage) && (
                <div className="flex justify-center mt-8">
                  <motion.button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Load More'}
                    <ChevronDown className="h-4 w-4" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
