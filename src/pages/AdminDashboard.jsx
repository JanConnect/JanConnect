import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Search,Filter,ArrowUpDown,Download,RefreshCw,MoreHorizontal,User,AlertCircle,CheckCircle,Clock,XCircle,MapPin,MessageSquare,ThumbsUp,ArrowBigUp,FileText,ChevronDown,ChevronUp,AlertTriangle,ArrowLeft,Mail,Phone,Send,Edit3,Calendar,Eye,Paperclip} from 'lucide-react';

  const generateComplaintData = () => {
  const statuses = ['pending', 'in_progress', 'resolved', 'rejected'];
  const categories = ['Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution'];
  const areas = ['Downtown', 'Suburbia', 'West End'];
  const priorities = ['high', 'medium', 'low'];
  
  const complaints = [];
  
  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const submittedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    
    complaints.push({
      id: i,
      title: `${category} issue #${i} in ${area}`,
      description: `This is a detailed description of complaint #${i}. The issue relates to ${category.toLowerCase()} and needs attention in the ${area} area. Residents have reported multiple instances of this problem occurring over the past few weeks.`,
      category,
      status,
      area,
      priority,
      date: submittedDate.toISOString(),
      upvotes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
      submittedAt: submittedDate.toISOString(),
      urgency: priority,
      submissionsCount: Math.floor(Math.random() * 5) + 1,
      media: [
        { type: 'image', url: `https://picsum.photos/600/400?random=${i}`, id: `${i}-1` },
        { type: 'image', url: `https://picsum.photos/600/400?random=${i + 100}`, id: `${i}-2` }
      ],
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} ${area} Street`,
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01
      },
      timeline: [
        {
          id: '1',
          type: 'created',
          title: 'Complaint Submitted',
          description: 'Initial report created by citizen',
          timestamp: submittedDate.toISOString(),
          user: `User ${i}`
        },
        ...(status !== 'pending' ? [{
          id: '2',
          type: 'assigned',
          title: 'Assigned to Department',
          description: `Forwarded to ${category} department`,
          timestamp: new Date(submittedDate.getTime() + Math.random() * 86400000).toISOString(),
          user: 'Admin User'
        }] : []),
        ...(status === 'resolved' ? [{
          id: '3',
          type: 'resolved',
          title: 'Issue Resolved',
          description: 'Complaint has been successfully resolved',
          timestamp: new Date(submittedDate.getTime() + Math.random() * 86400000 * 2).toISOString(),
          user: 'Department Lead'
        }] : [])
      ],
      commentsData: [
        {
          id: '1',
          user: 'Department Inspector',
          text: `Assessed the ${category.toLowerCase()} issue. Priority level: ${priority}. Will proceed with necessary actions.`,
          timestamp: new Date(submittedDate.getTime() + Math.random() * 86400000).toISOString()
        }
      ],
      reporter: {
        id: `user-${i}`,
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        avatar: `https://ui-avatars.com/api/?name=Reporter+${i}&background=3b82f6&color=fff`
      },
      assignedTo: status !== 'pending' ? {
        id: `dept-${category.toLowerCase().replace(/\s+/g, '-')}`,
        name: `${category} Department`,
        members: [
          { id: `user-dept-${i}`, name: `${category} Lead`, role: 'Department Head' },
          { id: `user-tech-${i}`, name: `Technician ${i}`, role: 'Field Technician' }
        ]
      } : null,
      duplicates: []
    });
  }
  
  return complaints;
};

// Generate stats based on complaints
const generateStats = (complaints) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const rejected = complaints.filter(c => c.status === 'rejected').length;
  
  return { total, pending, inProgress, resolved, rejected };
};

// Simple Info icon component
const Info = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// Complaint Card Component
const ComplaintCard = ({ complaint, onClick, index }) => {
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    in_progress: <AlertCircle className="h-5 w-5 text-blue-500" />,
    resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  const statusText = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected'
  };
  
  const priorityIcons = {
    high: <AlertTriangle className="h-5 w-5 text-red-500" />,
    medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    low: <Info className="h-5 w-5 text-blue-500" />
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
            <h3 className="font-semibold text-white text-lg mb-1">{complaint.title}</h3>
            <p className="text-white/70 text-sm line-clamp-2">{complaint.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              {priorityIcons[complaint.priority]}
            </div>
            
            <div className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white">
              {complaint.category}
            </div>
            
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              complaint.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
              complaint.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
              complaint.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>
              {statusText[complaint.status]}
            </span>
          </div>
          
          <span className="text-xs text-white/70">
            {new Date(complaint.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-white/60 text-sm mt-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{complaint.area}</span>
        </div>
        
        <div className="flex items-center">
          <ArrowBigUp className="h-4 w-4 mr-1" />
          <span>{complaint.upvotes} upvotes</span>
        </div>
        
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{complaint.comments} comments</span>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Bar Component
const FilterBar = ({ filters, onFilterChange }) => {
  const categories = ['all', 'Infrastructure', 'Sanitation', 'Public Safety', 'Noise Pollution'];
  const statuses = ['all', 'pending', 'in_progress', 'resolved', 'rejected'];
  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
    { value: 'high_upvotes', label: 'High Upvotes (30+)' },
    { value: 'medium_upvotes', label: 'Medium Upvotes (10-29)' },
    { value: 'low_upvotes', label: 'Low Upvotes (<10)' }
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
            placeholder="Search complaints..."
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
                  {category === 'all' ? 'All Categories' : category}
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
            <span>{filters.status === 'all' ? 'All Statuses' : statuses.find(s => s === filters.status)}</span>
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
                  {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
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
      title: 'Total Complaints',
      value: stats.total,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-500/20'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      color: 'bg-green-500/20'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
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
  if (!media || media.length === 0) {
    return (
      <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
        <div className="text-white/60 italic">No media attached to this complaint</div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative group overflow-hidden rounded-xl">
            <img
              src={item.url}
              alt="Complaint media"
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

// Timeline Component
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
        <div key={event.id} className="flex gap-4">
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
              <h3 className="font-medium text-white">{event.title}</h3>
              <span className="text-sm text-white/60">
                {new Date(event.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/70 text-sm mt-1">{event.description}</p>
            <div className="flex items-center mt-2 text-sm text-white/60">
              <User className="h-3 w-3 mr-1" />
              {event.user}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Integrated Component
const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'detail'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [allComplaints] = useState(generateComplaintData());
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all',
    sort: 'date_desc',
    search: '',
    page: 1,
    limit: 5
  });

  // Filter and paginate complaints
  const getFilteredComplaints = useCallback(() => {
    let filtered = [...allComplaints];
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      if (filters.priority === 'high_upvotes') {
        filtered = filtered.filter(c => c.upvotes >= 30);
      } else if (filters.priority === 'medium_upvotes') {
        filtered = filtered.filter(c => c.upvotes >= 10 && c.upvotes < 30);
      } else if (filters.priority === 'low_upvotes') {
        filtered = filtered.filter(c => c.upvotes < 10);
      } else {
        filtered = filtered.filter(c => c.priority === filters.priority);
      }
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm) || 
        c.description.toLowerCase().includes(searchTerm) ||
        c.area.toLowerCase().includes(searchTerm)
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
          filtered.sort((a, b) => b.upvotes - a.upvotes);
          break;
        default:
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    }
    
    return filtered;
  }, [allComplaints, filters]);

  const filteredComplaints = getFilteredComplaints();
  const displayedComplaints = filteredComplaints.slice(0, filters.page * filters.limit);
  const hasMore = displayedComplaints.length < filteredComplaints.length;
  const stats = generateStats(filteredComplaints);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedComplaint(null);
  };

  const handleExport = () => {
    console.log('Exporting data...');
    alert('Export functionality would download a CSV file with the current filtered data');
  };

  const handleRefresh = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

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
                <h1 className="text-2xl font-bold text-white">{selectedComplaint.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedComplaint.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    selectedComplaint.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    selectedComplaint.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedComplaint.status === 'pending' ? 'Pending' :
                     selectedComplaint.status === 'in_progress' ? 'In Progress' :
                     selectedComplaint.status === 'resolved' ? 'Resolved' : 'Rejected'}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedComplaint.urgency === 'low' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    selectedComplaint.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedComplaint.urgency} Priority
                  </span>
                  
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                    {selectedComplaint.category}
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
              <div className="text-white font-medium">COMP-{String(selectedComplaint.id).padStart(3, '0')}</div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Submitted</span>
              </div>
              <div className="text-white font-medium">
                {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <ArrowBigUp className="h-4 w-4" />
                <span className="text-sm">Upvotes</span>
              </div>
              <div className="text-white font-medium">{selectedComplaint.upvotes}</div>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Submissions</span>
              </div>
              <div className="text-white font-medium">{selectedComplaint.submissionsCount}</div>
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
                <p className="text-white/80 leading-relaxed">{selectedComplaint.description}</p>
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
                  <span>{selectedComplaint.location.address}</span>
                </div>
                <div className="h-48 bg-white/5 rounded-xl border border-white/20 flex items-center justify-center">
                  <span className="text-white/60">Interactive map would be displayed here</span>
                </div>
              </motion.div>
              
              {/* Timeline */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
                <Timeline events={selectedComplaint.timeline} />
              </motion.div>
              
              {/* Comments */}
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>
                <div className="space-y-6">
                  {selectedComplaint.commentsData && selectedComplaint.commentsData.length > 0 ? (
                    <div className="space-y-4">
                      {selectedComplaint.commentsData.map((comment, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-indigo-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{comment.user}</span>
                              <span className="text-xs text-white/50">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white/80 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/60 italic">No comments yet</div>
                  )}

                  <form className="mt-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200 flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>
                </div>
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
                    >
                      <option style={{backgroundColor:"gray"}} value="pending">Pending</option>
                      <option style={{backgroundColor:"gray"}} value="in_progress">In Progress</option>
                      <option style={{backgroundColor:"gray"}} value="resolved">Resolved</option>
                      <option style={{backgroundColor:"gray"}} value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Priority</label>
                    <select
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      value={selectedComplaint.urgency}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Add Note</label>
                    <textarea
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      rows="3"
                      placeholder="Add an update note..."
                    />
                  </div>
                  
                  <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2">
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
                        <h3 className="font-medium text-white">{selectedComplaint.assignedTo.name}</h3>
                        <p className="text-sm text-white/70">{selectedComplaint.assignedTo.members.length} members</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedComplaint.assignedTo.members.map(member => (
                        <div key={member.id} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <User className="h-3 w-3 text-indigo-300" />
                          </div>
                          <span className="text-white/80">{member.name}</span>
                          <span className="text-white/50">({member.role})</span>
                        </div>
                      ))}
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
                    src={selectedComplaint.reporter.avatar}
                    alt={selectedComplaint.reporter.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-white">{selectedComplaint.reporter.name}</h3>
                    <p className="text-sm text-white/70">Reporter</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">{selectedComplaint.reporter.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">{selectedComplaint.reporter.phone}</span>
                  </div>
                  
                  <button className="w-full mt-4 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition-colors duration-200 flex items-center justify-center gap-2">
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
            <p className="text-white/70">Manage citizen complaints and ensure timely resolution</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <motion.button
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="h-5 w-5 text-white" />
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
              <span className="text-white text-sm">Admin</span>
            </div>
          </div>
        </motion.header>

        {/* Filter Bar */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

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
                <h3 className="text-xl font-semibold text-white mb-2">No complaints found</h3>
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
                      key={complaint.id}
                      complaint={complaint}
                      onClick={() => handleComplaintClick(complaint)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <motion.button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load More
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