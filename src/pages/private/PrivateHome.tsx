// components/PrivateHome.tsx
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Users, 
  Clock, 
  Phone, 
  MessageCircle, 
  Home,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Star,
  MapPin,
  Calendar,
  ChevronRight,
  Bell,
  Search,
  Plus,
  ArrowLeft,
  Settings,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Types
interface ServiceProvider {
  id: string;
  name: string;
  role: string;
  phone: string;
  rating: number;
  avatar: string;
  eta: string;
  completedJobs: number;
}

interface Issue {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'assigned' | 'resolved';
  createdAt: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  provider?: ServiceProvider;
  updates?: { time: string; message: string }[];
}

interface CommunityMember {
  id: string;
  name: string;
  apartment: string;
  avatar: string;
  joinDate: string;
}

// Mock data
const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Plumbing Expert',
    phone: '+91 98765 43210',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    eta: '15 mins',
    completedJobs: 347
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Master Electrician',
    phone: '+91 98765 43211',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1494790108777-223fd4f5609d?w=100&h=100&fit=crop',
    eta: '10 mins',
    completedJobs: 892
  },
  {
    id: '3',
    name: 'Anil Mehta',
    role: 'AC & Refrigeration',
    phone: '+91 98765 43212',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    eta: '25 mins',
    completedJobs: 156
  }
];

const mockCommunity: CommunityMember[] = [
  { id: '1', name: 'Amit Sharma', apartment: 'A-401', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', joinDate: '2023-12-01' },
  { id: '2', name: 'Neha Gupta', apartment: 'B-203', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', joinDate: '2023-11-15' },
  { id: '3', name: 'Vikram Mehta', apartment: 'C-102', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', joinDate: '2023-12-10' },
];

const PrivateHome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const society = searchParams.get('society') || 'Emerald Heights';
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'issues' | 'community' | 'profile'>('dashboard');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssue, setNewIssue] = useState({ title: '', category: '', description: '', priority: 'medium' as const });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hero image path
  const heroBg = "/images/hero-bg.png";

  // Load mock issues on mount
  useEffect(() => {
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Leaking Kitchen Sink',
        category: 'Plumbing',
        status: 'assigned',
        priority: 'high',
        createdAt: '2024-01-15T10:30:00',
        description: 'Water leaking from under the sink, need immediate attention',
        provider: mockProviders[0],
        updates: [
          { time: '10:30 AM', message: 'Issue reported' },
          { time: '10:45 AM', message: 'Professional assigned' },
          { time: '11:00 AM', message: 'On the way - ETA 15 mins' }
        ]
      },
      {
        id: '2',
        title: 'AC Not Cooling',
        category: 'HVAC',
        status: 'open',
        priority: 'medium',
        createdAt: '2024-01-16T14:20:00',
        description: 'Living room AC blowing warm air'
      },
      {
        id: '3',
        title: 'Power Outage in Bedroom',
        category: 'Electrical',
        status: 'resolved',
        priority: 'high',
        createdAt: '2024-01-14T09:15:00',
        description: 'No power in master bedroom',
        provider: mockProviders[1],
        updates: [
          { time: '09:15 AM', message: 'Issue reported' },
          { time: '09:30 AM', message: 'Professional assigned' },
          { time: '09:50 AM', message: 'Issue resolved' }
        ]
      }
    ];
    setIssues(mockIssues);
  }, []);

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const issue: Issue = {
      id: Date.now().toString(),
      ...newIssue,
      status: 'open',
      createdAt: new Date().toISOString(),
      updates: [{ time: new Date().toLocaleTimeString(), message: 'Issue reported' }]
    };
    setIssues([issue, ...issues]);
    setShowIssueForm(false);
    setNewIssue({ title: '', category: '', description: '', priority: 'medium' });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'assigned': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const stats = {
    activeIssues: issues.filter(i => i.status !== 'resolved').length,
    resolvedIssues: issues.filter(i => i.status === 'resolved').length,
    communityMembers: 247,
    avgResponseTime: '18 mins'
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section with Overlay Header - REDUCED HEIGHT */}
      <div className="relative w-full h-[500px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Header - Overlay on Image with Glassmorphism */}
        <header className="absolute top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-white" />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-white leading-tight drop-shadow-md">
                    {society}
                  </h1>
                  <p className="text-xs text-white/80 drop-shadow">Member since Jan 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                  <Search className="h-4 w-4 text-white" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors relative"
                  >
                    <Bell className="h-4 w-4 text-white" />
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full border border-white/50" />
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-200/50">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="px-4 py-3 hover:bg-white/60 cursor-pointer">
                              <p className="text-sm text-gray-900">Your issue #123 has been assigned</p>
                              <p className="text-xs text-gray-600 mt-1">5 minutes ago</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Menu */}
                <button className="flex items-center justify-center h-8 w-8 bg-[#1B2B4B] text-white rounded-full text-xs font-medium ml-2 border-2 border-white/50 shadow-lg hover:bg-[#2a3f63] transition-colors">
                  JD
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <p className="text-[#E5B842] font-extrabold tracking-[0.15em] text-sm mb-4 drop-shadow-2xl">
            WELCOME BACK, JOHN
          </p>
          <h1 className="text-5xl sm:text-7xl text-white mb-4 leading-tight font-bold drop-shadow-2xl">
            Your home,<br />always taken care of.
          </h1>
          <p className="text-white font-medium text-lg mb-8 flex items-center gap-2 drop-shadow-2xl">
            <span className="font-bold">{stats.activeIssues}</span> active issues <span className="text-white/60">•</span> <span className="font-bold">{stats.resolvedIssues}</span> resolved this month
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <motion.button 
              onClick={() => setShowIssueForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-[#E5B842] hover:bg-[#f5cc5c] text-gray-900 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#E5B842]/50"
            >
              Report an Issue
            </motion.button>
            <motion.button 
              onClick={() => setActiveTab('issues')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Issues
            </motion.button>
          </div>
        </div>

        {/* Gradient Blur overlay effect at the bottom blending into gray-50 */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent backdrop-blur-[2px]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-16 z-20">
        
        {/* Navigation Tabs - WITHOUT BOX, with larger bold text, active state, and MUCH MORE SPACE from image */}
        <div className="flex justify-center items-center gap-12 mb-12 pt-16">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'issues', label: 'Issues', icon: AlertCircle },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 text-xl font-extrabold transition-colors duration-200 ${
                  isActive 
                    ? 'text-gray-400' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-gray-400' : 'text-gray-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Floating Stats Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="w-full sm:w-1/4 py-4 sm:py-0 text-center sm:text-left sm:pl-4">
                <p className="text-4xl font-bold text-[#0F172A] mb-1 font-serif">{stats.activeIssues}</p>
                <p className="text-sm font-bold text-[#0F172A]">Active Issues</p>
                <p className="text-sm text-gray-500 mt-1">Needs attention</p>
              </div>
              <div className="w-full sm:w-1/4 py-4 sm:py-0 text-center sm:text-left sm:pl-10">
                <p className="text-4xl font-bold text-[#0F172A] mb-1 font-serif">{stats.avgResponseTime}</p>
                <p className="text-sm font-bold text-[#0F172A]">Avg Response</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
              <div className="w-full sm:w-1/4 py-4 sm:py-0 text-center sm:text-left sm:pl-10">
                <p className="text-4xl font-bold text-[#0F172A] mb-1 font-serif">94%</p>
                <p className="text-sm font-bold text-[#0F172A]">Satisfaction</p>
                <p className="text-sm text-gray-500 mt-1">Community wide</p>
              </div>
              <div className="w-full sm:w-1/4 py-4 sm:py-0 text-center sm:text-left sm:pl-10">
                <p className="text-4xl font-bold text-[#0F172A] mb-1 font-serif">12</p>
                <p className="text-sm font-bold text-[#0F172A]">Professionals</p>
                <p className="text-sm text-gray-500 mt-1">Available now</p>
              </div>
            </div>

            {/* Quick Actions & Recent Issues */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowIssueForm(true)}
                      className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Report Issue</p>
                        <p className="text-xs text-white/80">Get help instantly</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Join Community</p>
                        <p className="text-xs text-gray-600">Connect with neighbors</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Schedule Service</p>
                        <p className="text-xs text-gray-600">Book in advance</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Issues */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
                    <button 
                      onClick={() => setActiveTab('issues')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {issues.slice(0, 3).map((issue) => (
                      <div key={issue.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(issue.status)}
                            <span className="font-medium text-gray-900">{issue.title}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Issues View */}
        {activeTab === 'issues' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pt-10"
          >
            {/* Issue Form Modal */}
            <AnimatePresence>
              {showIssueForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowIssueForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-semibold mb-6">Report New Issue</h2>
                    <form onSubmit={handleSubmitIssue} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                        <input
                          type="text"
                          required
                          value={newIssue.title}
                          onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Leaking Faucet"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          required
                          value={newIssue.category}
                          onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select category</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="HVAC">HVAC</option>
                          <option value="Appliance">Appliance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={newIssue.priority}
                          onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          required
                          value={newIssue.description}
                          onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe the issue in detail..."
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowIssueForm(false)}
                          className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Submit Issue
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Issues Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">My Issues</h2>
              <button
                onClick={() => setShowIssueForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Report Issue</span>
              </button>
            </div>

            {/* Issues List */}
            <div className="grid gap-4">
              {issues.map((issue) => (
                <motion.div
                  key={issue.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          {getStatusIcon(issue.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{issue.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{issue.category}</span>
                            <span>•</span>
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Issue Timeline */}
                      {issue.updates && issue.updates.length > 0 && (
                        <div className="mt-4 ml-14">
                          <div className="space-y-2">
                            {issue.updates.map((update, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full" />
                                <span className="text-gray-500">{update.time}</span>
                                <span className="text-gray-700">{update.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Assigned Provider */}
                    {issue.provider && (
                      <div className="lg:w-80 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl">
                        <p className="text-xs font-medium text-gray-500 mb-3">ASSIGNED PROFESSIONAL</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={issue.provider.avatar}
                              alt={issue.provider.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{issue.provider.name}</p>
                              <p className="text-sm text-gray-600">{issue.provider.role}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600 ml-1">{issue.provider.rating}</span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-emerald-600 font-medium">ETA: {issue.provider.eta}</span>
                              </div>
                            </div>
                          </div>
                          <a
                            href={`tel:${issue.provider.phone}`}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Phone className="h-4 w-4 text-blue-600" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {issue.status === 'open' && (
                    <div className="mt-4 flex gap-2 ml-14">
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Track Status
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Cancel Request
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Community View */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-3 gap-8 pt-10"
          >
            {/* Join Community Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-8 text-white sticky top-24">
                <Users className="h-12 w-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-semibold mb-2">Join Our Community</h3>
                <p className="text-blue-50 mb-6">
                  Connect with 247 neighbors, participate in events, and stay updated with community news.
                </p>
                <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                  Join Now
                </button>

                {/* Community Stats */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-50">Active Members</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-50">Issues Resolved</span>
                      <span className="font-semibold">1,892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-50">Avg Response</span>
                      <span className="font-semibold">18 mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Members</h3>
                <div className="space-y-4">
                  {mockCommunity.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.apartment} • Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="h-12 w-12 bg-blue-100 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs text-blue-600 font-medium">JAN</span>
                        <span className="text-lg font-bold text-blue-600">{20 + i}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Community Meeting</h4>
                        <p className="text-sm text-gray-500">7:00 PM • Clubhouse</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile View */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto pt-10"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                  alt="Profile"
                  className="h-24 w-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-gray-100"
                />
                <h2 className="text-2xl font-semibold text-gray-900">John Doe</h2>
                <p className="text-gray-500">A-401 • Member since Dec 2023</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">john.doe@email.com</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">+91 98765 43210</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Apartment</p>
                  <p className="font-medium text-gray-900">A-401, {society}</p>
                </div>

                <button className="w-full mt-4 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PrivateHome;