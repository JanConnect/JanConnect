import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
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
  Paperclip,
  LogOut,
  Settings,
  UserCircle,
  Plus,
  Users,
  X,
  BarChart3,
  TrendingUp,
  PieChart,
  Camera,
  Upload,
  MessageCircle,
  UserMinus
} from 'lucide-react';

import GoogleMapView from './GoogleMapView';
import ScrollHeatmap from "../pages/ScrollHeatmap";

// Import your existing API functions
import { 
  getAllReports, 
  getReportsAnalytics, 
  updateReportStatus,
  getReportById
} from '../api/report';

// Mock implementation for assignReportToDepartment
const assignReportToDepartment = async (reportId, departmentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          message: `Report ${reportId} assigned to department ${departmentId} successfully`
        }
      });
    }, 1000);
  });
};

// Mock implementation for unassignReportFromDepartment
const unassignReportFromDepartment = async (reportId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          message: `Report ${reportId} unassigned from department successfully`
        }
      });
    }, 1000);
  });
};

// Mock implementation for addComplaintComment
const addComplaintComment = async (reportId, commentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          comment: {
            id: Date.now().toString(),
            message: commentData.message,
            media: commentData.media,
            timestamp: new Date().toISOString(),
            author: { name: 'Admin User' }
          }
        }
      });
    }, 1000);
  });
};

import { getCurrentUser, logoutUser as apiLogout } from '../api/auth';
import { getAllDepartments, createDepartment, updateDepartment } from '../api/department';
import { getAllMunicipalities } from '../api/municipality';
import Pagination from './Pagination';

// Fallback data generator for when APIs are not available
const generateFallbackComplaintData = () => {
  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
  const categories = ['Infrastructure', 'Sanitation', 'Street Lighting', 'Water Supply', 'Traffic', 'Parks', 'Other'];
  const areas = ['Downtown', 'Suburbia', 'West End'];
  const priorities = [5, 4, 3, 2, 1];
  
  const complaints = [];
  
  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const submittedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const resolvedDate = status === 'resolved' ? new Date(submittedDate.getTime() + Math.random() * 86400000 * 7) : null;
    
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
      resolvedAt: resolvedDate?.toISOString(),
      resolutionTime: resolvedDate ? Math.floor((resolvedDate - submittedDate) / (1000 * 60 * 60 * 24)) : null,
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
        name: `${category} Department`,
        _id: `dept_${category}`
      } : null,
      reportedBy: {
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        avatar: `https://ui-avatars.com/api/?name=Reporter+${i}&background=3b82f6&color=fff`
      },
      updates: [
        {
          id: `update_${i}_1`,
          date: submittedDate.toISOString(),
          message: 'Report submitted by citizen',
          updatedBy: { name: `Reporter ${i}` },
          type: 'created'
        },
        ...(status !== 'pending' ? [{
          id: `update_${i}_2`,
          date: new Date(submittedDate.getTime() + Math.random() * 86400000).toISOString(),
          message: `Report forwarded to ${category} department`,
          updatedBy: { name: 'Admin User' },
          type: 'assigned'
        }] : []),
        ...(status === 'resolved' ? [{
          id: `update_${i}_3`,
          date: resolvedDate.toISOString(),
          message: 'Issue has been successfully resolved',
          updatedBy: { name: 'Department Lead' },
          type: 'resolved',
          media: [`https://picsum.photos/400/300?random=${i + 100}`]
        }] : [])
      ]
    });
  }
  
  return complaints;
};

// Generate dummy staff data
const generateDummyStaffData = () => {
  return [
    { _id: 'staff_1', name: 'John Smith', email: 'john.smith@municipality.gov', role: 'Engineer' },
    { _id: 'staff_2', name: 'Jane Doe', email: 'jane.doe@municipality.gov', role: 'Sanitation Specialist' },
    { _id: 'staff_3', name: 'Robert Johnson', email: 'robert.j@municipality.gov', role: 'Electrician' },
    { _id: 'staff_4', name: 'Sarah Williams', email: 'sarah.w@municipality.gov', role: 'Water Technician' },
    { _id: 'staff_5', name: 'Michael Brown', email: 'michael.b@municipality.gov', role: 'Traffic Controller' },
    { _id: 'staff_6', name: 'Emily Davis', email: 'emily.d@municipality.gov', role: 'Park Maintenance' },
    { _id: 'staff_7', name: 'David Wilson', email: 'david.w@municipality.gov', role: 'General Maintenance' },
    { _id: 'staff_8', name: 'Lisa Anderson', email: 'lisa.a@municipality.gov', role: 'Coordinator' },
    { _id: 'staff_9', name: 'James Taylor', email: 'james.t@municipality.gov', role: 'Inspector' },
    { _id: 'staff_10', name: 'Jessica Martinez', email: 'jessica.m@municipality.gov', role: 'Administrator' }
  ];
};

// Generate analytics data by department and month
const generateDepartmentAnalytics = (complaints, departments) => {
  const analytics = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  departments.forEach(dept => {
    const deptComplaints = complaints.filter(c => c.department?._id === dept._id);
    
    analytics[dept._id] = {
      name: dept.name,
      category: dept.category,
      monthlyData: months.map(month => {
        const monthIndex = months.indexOf(month);
        const monthComplaints = deptComplaints.filter(c => {
          const date = new Date(c.submittedAt);
          return date.getMonth() === monthIndex;
        });
        
        return {
          month,
          pending: monthComplaints.filter(c => c.status === 'pending').length,
          inProgress: monthComplaints.filter(c => c.status === 'in-progress').length,
          resolved: monthComplaints.filter(c => c.status === 'resolved').length,
          avgResolutionTime: monthComplaints
            .filter(c => c.resolutionTime)
            .reduce((acc, c) => acc + c.resolutionTime, 0) / 
            Math.max(monthComplaints.filter(c => c.resolutionTime).length, 1)
        };
      }),
      totalComplaints: deptComplaints.length,
      resolvedComplaints: deptComplaints.filter(c => c.status === 'resolved').length,
      avgResolutionTime: deptComplaints
        .filter(c => c.resolutionTime)
        .reduce((acc, c) => acc + c.resolutionTime, 0) / 
        Math.max(deptComplaints.filter(c => c.resolutionTime).length, 1)
    };
  });
  
  return analytics;
};

const extractCoordinates = (location) => {
  if (!location) return null;
  
  if (location.coordinates && Array.isArray(location.coordinates)) {
    return location.coordinates;
  }
  
  if (location.lat && location.lng) {
    return [location.lat, location.lng];
  }
  
  if (location.latitude && location.longitude) {
    return [location.latitude, location.longitude];
  }
  
  if (location.coords && Array.isArray(location.coords)) {
    return location.coords;
  }
  
  return null;
};

const generateStatsFromComplaints = (complaints) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const rejected = complaints.filter(c => c.status === 'rejected').length;
  
  return { 
    totalReports: total, 
    pendingReports: pending, 
    inProgressReports: inProgress, 
    resolvedReports: resolved, 
    rejectedReports: rejected 
  };
};

const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length;
    return fallback;
  }
  return value;
};

const Info = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// Performance Analytics Modal Component
const PerformanceAnalyticsModal = ({ 
  isOpen, 
  onClose, 
  departments, 
  complaints,
  categories 
}) => {
  const [selectedFilter, setSelectedFilter] = useState('department');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    if (departments.length > 0 && complaints.length > 0) {
      const data = generateDepartmentAnalytics(complaints, departments);
      setAnalytics(data);
    }
  }, [departments, complaints]);

  const getFilteredData = () => {
    if (selectedFilter === 'department' && selectedDepartment !== 'all') {
      return analytics[selectedDepartment];
    } else if (selectedFilter === 'category' && selectedCategory !== 'all') {
      const deptIds = departments
        .filter(d => d.category === selectedCategory)
        .map(d => d._id);
      
      // Combine data from all departments in the category
      const combinedData = {
        name: `${selectedCategory} Category`,
        category: selectedCategory,
        monthlyData: Array.from({ length: 12 }, (_, i) => {
          const monthData = { 
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
            pending: 0, 
            inProgress: 0, 
            resolved: 0, 
            avgResolutionTime: 0 
          };
          
          deptIds.forEach(deptId => {
            if (analytics[deptId]) {
              const deptMonth = analytics[deptId].monthlyData[i];
              monthData.pending += deptMonth.pending;
              monthData.inProgress += deptMonth.inProgress;
              monthData.resolved += deptMonth.resolved;
            }
          });
          
          return monthData;
        })
      };
      
      return combinedData;
    }
    
    return null;
  };

  const filteredData = getFilteredData();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Performance Analytics
            </h2>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">View By</label>
              <select
              style={{ color: 'white', backgroundColor: 'gray',}}
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="department">Department</option>
                <option value="category">Category</option>
              </select>
            </div>

            {selectedFilter === 'department' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Select Department</label>
                <select
                style={{ color: 'white', backgroundColor: 'gray',}}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedFilter === 'category' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Select Category</label>
                <select
                style={{ color: 'white', backgroundColor: 'gray',}}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Analytics Display */}
          {filteredData ? (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">{filteredData.name}</h3>
                
<div className="h-96 w-full bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl">
  <div className="flex items-center justify-between mb-4">
    <h4 className="text-white/90 text-lg font-semibold">Monthly Progress </h4>
    <div className="text-xs text-white/50"></div>
  </div>

  {/* Chart container */}
  <div className="relative h-72 w-full overflow-hidden">
    {(() => {
      const dummyData = [
        { month: "Jan", pending: 20, inProgress: 40, resolved: 60 },
        { month: "Feb", pending: 35, inProgress: 50, resolved: 70 },
        { month: "Mar", pending: 25, inProgress: 30, resolved: 80 },
        { month: "Apr", pending: 50, inProgress: 60, resolved: 90 },
        { month: "May", pending: 40, inProgress: 45, resolved: 85 },
        { month: "Jun", pending: 30, inProgress: 55, resolved: 95 },
        { month: "Jul", pending: 45, inProgress: 65, resolved: 88 },
        { month: "Aug", pending: 38, inProgress: 52, resolved: 92 },
        { month: "Sep", pending: 28, inProgress: 40, resolved: 84 },
        { month: "Oct", pending: 42, inProgress: 58, resolved: 96 },
        { month: "Nov", pending: 36, inProgress: 48, resolved: 90 },
        { month: "Dec", pending: 32, inProgress: 50, resolved: 97 },
      ];

      const maxValue = 100;
      const chartWidth = 600;
      const chartHeight = 250;
      const stepX = chartWidth / (dummyData.length - 1);
      const leftMargin = 40;

      const yScale = (val) => chartHeight - (val / maxValue) * chartHeight;

      const makePath = (key, color, delay) => {
        let path = "";
        dummyData.forEach((d, i) => {
          const x = leftMargin + i * stepX;
          const y = yScale(d[key]);
          path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
        });
        return (
          <path
            d={path}
            stroke={color}
            fill="none"
            strokeWidth="3"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="drop-shadow-sm"
            style={{
              animation: `lineGrow 1.5s ease-out forwards`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      };

      const renderDots = (key, color, delay) =>
        dummyData.map((d, i) => {
          const x = leftMargin + i * stepX;
          const y = yScale(d[key]);
          return (
            <g key={`${key}-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={color}
                className="cursor-pointer opacity-0 dot"
                style={{
                  animation: `fadeIn 0.5s ease-out forwards, pulse 2s infinite`,
                  animationDelay: `${delay + i * 0.05}s, ${delay + 1.5}s`,
                }}
                onMouseOver={(e) => {
                  const tooltip = document.getElementById('data-tooltip');
                  if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `
                      <div class="font-bold text-white">${d.month}</div>
                      <div class="flex items-center mt-1">
                        <div class="w-3 h-3 bg-red-500/80 rounded mr-2"></div>
                        <span class="text-white">Pending: ${d.pending}%</span>
                      </div>
                      <div class="flex items-center mt-1">
                        <div class="w-3 h-3 bg-yellow-500/80 rounded mr-2"></div>
                        <span class="text-white">In Progress: ${d.inProgress}%</span>
                      </div>
                      <div class="flex items-center mt-1">
                        <div class="w-3 h-3 bg-green-500/80 rounded mr-2"></div>
                        <span class="text-white">Resolved: ${d.resolved}%</span>
                      </div>
                    `;
                    tooltip.style.left = `${e.pageX + 10}px`;
                    tooltip.style.top = `${e.pageY - 100}px`;
                  }
                }}
                onMouseOut={() => {
                  const tooltip = document.getElementById('data-tooltip');
                  if (tooltip) {
                    tooltip.style.display = 'none';
                  }
                }}
              />
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={color}
                className="cursor-pointer opacity-0"
                style={{
                  animation: `fadeIn 0.5s ease-out forwards`,
                  animationDelay: `${delay + i * 0.05}s`,
                }}
                fillOpacity="0.2"
              />
            </g>
          );
        });

      const renderAreas = (key, color, delay) => {
        let path = "";
        dummyData.forEach((d, i) => {
          const x = leftMargin + i * stepX;
          const y = yScale(d[key]);
          path += i === 0 ? `M${x},${chartHeight} L${x},${y}` : ` L${x},${y}`;
        });
        path += ` L${leftMargin + (dummyData.length - 1) * stepX},${chartHeight} Z`;
        
        return (
          <path
            d={path}
            fill={color}
            fillOpacity="0.1"
            className="opacity-0"
            style={{
              animation: `fadeIn 1s ease-out forwards`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      };

      return (
        <>
          {/* Grid lines + Y labels */}
          {[0, 25, 50, 75, 100].map((val, i) => {
            const y = yScale(val);
            return (
              <g key={i} className="absolute w-full">
                <div
                  className="absolute left-0 right-0 border-t border-white/10"
                  style={{ 
                    top: `${y}px`,
                    animation: `fadeIn 0.5s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  <span 
                    className="absolute text-xs text-white/60 bg-gray-900 px-1 rounded"
                    style={{
                      left: '10px',
                      animation: `slideInLeft 0.5s ease-out forwards`,
                      animationDelay: `${i * 0.1 + 0.2}s`
                    }}
                  >
                    {val}%
                  </span>
                </div>
              </g>
            );
          })}

          {/* SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox={`0 0 ${chartWidth + leftMargin + 20} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(239,68,68,0.3)" />
                <stop offset="100%" stopColor="rgba(239,68,68,0.1)" />
              </linearGradient>
              <linearGradient id="inProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(234,179,8,0.3)" />
                <stop offset="100%" stopColor="rgba(234,179,8,0.1)" />
              </linearGradient>
              <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(34,197,94,0.3)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0.1)" />
              </linearGradient>
            </defs>
            
            {/* Areas */}
            {renderAreas("pending", "url(#pendingGradient)", 0.2)}
            {renderAreas("inProgress", "url(#inProgressGradient)", 0.4)}
            {renderAreas("resolved", "url(#resolvedGradient)", 0.6)}
            
            {/* Lines */}
            {makePath("pending", "rgba(239,68,68,0.9)", 0)}
            {makePath("inProgress", "rgba(234,179,8,0.9)", 0.2)}
            {makePath("resolved", "rgba(34,197,94,0.9)", 0.4)}

            {/* Dots */}
            {renderDots("pending", "rgba(239,68,68,0.9)", 0.8)}
            {renderDots("inProgress", "rgba(234,179,8,0.9)", 0.9)}
            {renderDots("resolved", "rgba(34,197,94,0.9)", 1.0)}
          </svg>
        </>
      );
    })()}

    {/* X-axis labels */}
    <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-white/60" style={{width: 'calc(100% - 50px)', marginLeft: '40px'}}>
      {[
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ].map((month, i) => (
        <span 
          key={month}
          className="opacity-0"
          style={{
            animation: `fadeIn 0.5s ease-out forwards`,
            animationDelay: `${0.5 + i * 0.05}s`
          }}
        >
          {month}
        </span>
      ))}
    </div>
  </div>

  {/* Legend */}
  <div className="flex justify-center gap-6 mt-4">
    {[
      { color: "bg-red-500/80", text: "Pending" },
      { color: "bg-yellow-500/80", text: "In Progress" },
      { color: "bg-green-500/80", text: "Resolved" }
    ].map((item, i) => (
      <div 
        key={i} 
        className="flex items-center gap-2 opacity-0"
        style={{
          animation: `bounceIn 0.6s ease-out forwards`,
          animationDelay: `${1.2 + i * 0.1}s`
        }}
      >
        <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
        <span className="text-xs text-white/70">{item.text}</span>
      </div>
    ))}
  </div>

  {/* Tooltip */}
  <div 
    id="data-tooltip" 
    className="fixed hidden bg-gray-800/95 border border-gray-700 rounded-lg p-3 text-white text-xs shadow-xl z-50 transition-opacity duration-200"
    style={{minWidth: '150px'}}
  ></div>

  {/* Animations */}
  <style>
    {`
      @keyframes lineGrow {
        from { 
          stroke-dashoffset: 1000; 
          opacity: 0.5;
        }
        to { 
          stroke-dashoffset: 0; 
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInLeft {
        from { 
          opacity: 0;
          transform: translateX(-10px);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pulse {
        0% { r: 5; }
        50% { r: 6; }
        100% { r: 5; }
      }
      
      .dot:hover {
        r: 8;
        transition: r 0.2s ease;
      }
      
      /* Ensure tooltip is above everything */
      #data-tooltip {
        z-index: 9999 !important;
      }
    `}
  </style>
</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-white/60">
              Select a department or category to view analytics
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Department Management Modal Component
const DepartmentManagementModal = ({ 
  isOpen, 
  onClose, 
  departments, 
  onDepartmentCreate, 
  onDepartmentUpdate,
  staffMembers 
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name || '');
      setCategory(editingDepartment.category || '');
      setSelectedStaff(editingDepartment.staffMembers || []);
    } else {
      setName('');
      setCategory('');
      setSelectedStaff([]);
    }
  }, [editingDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const departmentData = {
        name,
        category,
        staffMembers: selectedStaff
      };

      if (editingDepartment) {
        await onDepartmentUpdate(editingDepartment._id, departmentData);
      } else {
        await onDepartmentCreate(departmentData);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setSelectedStaff([]);
    setEditingDepartment(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleStaffSelection = (staffId) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {editingDepartment ? 'Edit Department' : 'Create New Department'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-white/70 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
            <input
            style={{ color: 'white', backgroundColor: 'gray/20',}}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
              placeholder="e.g., Infrastructure, Sanitation, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Assign Staff Members</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staffMembers.map(staff => (
                <div key={staff._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`staff-${staff._id}`}
                    checked={selectedStaff.includes(staff._id)}
                    onChange={() => toggleStaffSelection(staff._id)}
                    className="mr-2"
                  />
                  <label htmlFor={`staff-${staff._id}`} className="text-white">
                    {staff.name} - {staff.email} ({staff.role})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg border border-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// **FIXED: Profile Dropdown Component with React Portal**
const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ 
        top: rect.bottom + window.scrollY + 8, // 8px gap
        left: rect.right + window.scrollX - 224 // 224px = dropdown width, right align
      });
    }
  }, [isOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all duration-200 relative z-10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-white text-sm hidden sm:block">{safeRender(user?.name, 'Admin')}</span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* **PORTAL DROPDOWN MENU - FIXES Z-INDEX ISSUES** */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden"
            style={{
              top: position.top,
              left: position.left,
              width: 224,
              zIndex: 9999
            }}
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{safeRender(user?.name, 'Admin')}</div>
                  <div className="text-white/60 text-xs">{safeRender(user?.email, 'admin@janconnect.com')}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body // **RENDERS TO DOCUMENT.BODY TO ESCAPE PARENT CONTAINERS**
      )}
    </>
  );
};

// Complaint Card Component
const ComplaintCard = ({ complaint, onClick, index }) => {
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    'in-progress': <RefreshCw className="h-5 w-5 text-blue-500" />,
    resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  const statusText = {
    pending: 'Pending',
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

  const getUpvoteCount = () => {
    if (typeof complaint.upvoteCount === 'number') return complaint.upvoteCount;
    if (typeof complaint.upvotes === 'number') return complaint.upvotes;
    if (Array.isArray(complaint.upvotes)) return complaint.upvotes.length;
    return 0;
  };

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
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 cursor-pointer hover:shadow-lg transition-all duration-300 mb-4 max-w-4xl mx-auto min-h-32 flex flex-col justify-between hover:bg-white/15"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            {statusIcons[complaint.status]}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-lg mb-1">
              {safeRender(complaint.title, 'Untitled Report')}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-2">
              {safeRender(complaint.description, 'No description available')}
            </p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                <FileText className="h-3 w-3" />
                {safeRender(complaint.category, 'Unknown Category')}
              </span>
              
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-md border border-white/20">
                <MapPin className="h-3 w-3" />
                {safeRender(complaint.area || complaint.municipality?.name, 'Unknown Location')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
          <div className="flex items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-col sm:flex-row">
            <div className="hidden sm:block">
              {priorityIcons[complaint.priority] || priorityIcons[complaint.urgency]}
            </div>
            
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              complaint.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              complaint.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              complaint.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {statusText[complaint.status] || 'Unknown'}
            </span>
          </div>
          
          <span className="text-xs text-white/70">
            {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-white/60 text-sm mt-3">
        <div className="flex items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
          <div className="flex items-center">
            <ArrowBigUp className="h-4 w-4 mr-1" />
            <span>{getUpvoteCount()} upvotes</span>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{getUpdatesCount()} updates</span>
          </div>
        </div>
        
        <div className="text-xs">
          ID: {safeRender(complaint.reportId || `#${String(complaint._id).slice(-4)}`, 'N/A')}
        </div>
      </div>
    </motion.div>
  );
};

// Filter Bar Component 
const FilterBar = ({ filters, onFilterChange, categories = [], municipalities = [] }) => {
  const statuses = ['all', 'pending', 'in-progress', 'resolved', 'rejected'];
  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: '5', label: 'Critical (5)' },
    { value: '4', label: 'High (4)' },
    { value: '3', label: 'Medium (3)' },
    { value: '2', label: 'Low (2)' },
    { value: '1', label: 'Very Low (1)' },
  ];
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const categoryOptions = categories && categories.length > 0 
    ? categories 
    : ['Infrastructure', 'Sanitation', 'Street Lighting', 'Water Supply', 'Traffic', 'Parks', 'Other'];

  useEffect(() => {
    const handleClickOutside = () => {
      setIsCategoryOpen(false);
      setIsStatusOpen(false);
      setIsPriorityOpen(false);
    };

    if (isCategoryOpen || isStatusOpen || isPriorityOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoryOpen, isStatusOpen, isPriorityOpen]);

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
            placeholder="Search reports by title, description, or location..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCategoryOpen(!isCategoryOpen);
              setIsStatusOpen(false);
              setIsPriorityOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {filters.category === 'all' ? 'All Categories' : filters.category || 'Select Category'}
            </span>
            {isCategoryOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterChange({ category: 'all' });
                  setIsCategoryOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 ${
                  filters.category === 'all' ? 'bg-white/20 text-blue-200' : ''
                }`}
              >
                All Categories
              </button>
              {categoryOptions.map(category => (
                <button
                  key={category}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ category });
                    setIsCategoryOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.category === category ? 'bg-white/20 text-blue-200' : ''
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
            onClick={(e) => {
              e.stopPropagation();
              setIsStatusOpen(!isStatusOpen);
              setIsCategoryOpen(false);
              setIsPriorityOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {filters.status === 'all' ? 'All Statuses' : 
               filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1).replace('-', ' ') : 'Select Status'}
            </span>
            {isStatusOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ status });
                    setIsStatusOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.status === status ? 'bg-white/20 text-blue-200' : ''
                  }`}
                >
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Priority Filter */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPriorityOpen(!isPriorityOpen);
              setIsCategoryOpen(false);
              setIsStatusOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {priorities.find(p => p.value === filters.priority)?.label || 'All Priorities'}
            </span>
            {isPriorityOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isPriorityOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ priority: priority.value });
                    setIsPriorityOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.priority === priority.value ? 'bg-white/20 text-blue-200' : ''
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.category !== 'all' || filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
          <span className="text-white/70 text-sm">Active filters:</span>
          
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
              Category: {filters.category}
              <button 
                onClick={() => onFilterChange({ category: 'all' })}
                className="hover:text-indigo-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs">
              Status: {filters.status}
              <button 
                onClick={() => onFilterChange({ status: 'all' })}
                className="hover:text-blue-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-md text-xs">
              Priority: {priorities.find(p => p.value === filters.priority)?.label}
              <button 
                onClick={() => onFilterChange({ priority: 'all' })}
                className="hover:text-yellow-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs">
              Search: "{filters.search}"
              <button 
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-green-200"
              >
                ×
              </button>
            </span>
          )}
          
          <button 
            onClick={() => onFilterChange({ 
              category: 'all', 
              status: 'all', 
              priority: 'all', 
              search: '' 
            })}
            className="text-xs text-white/70 hover:text-white underline"
            >
            Clear all
          </button>
        </div>
      )}
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
  src={`${import.meta.env.BASE_URL}${item.url}`}
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

// Location Display Component with Google Maps
const LocationDisplay = ({ location }) => {
  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location
      </h2>
      <div className="space-y-4">
        {location?.address && (
          <div className="text-white/90">
            <span className="text-white/60">Address: </span>
            {location.address}
          </div>
        )}
        
        {/* Google Maps Integration */}
        {location?.coordinates && Array.isArray(location.coordinates) && (
          <div className="mt-4 rounded-xl overflow-hidden h-64">
            <GoogleMapView 
              coordinates={extractCoordinates(location)}
              address={location.address}
              title="Report Location"
            />
          </div>
        )}
        
        {!location?.address && !location?.coordinates && (
          <div className="text-white/60 italic">No location information available</div>
        )}
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
            {/* Media attachments for timeline events */}
            {event.media && Array.isArray(event.media) && event.media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {event.media.map((mediaUrl, mediaIndex) => (
                  <img
  key={mediaIndex}
  src={`${import.meta.env.BASE_URL}${mediaUrl}`}
  alt={`Update media ${mediaIndex + 1}`}
  className="w-full h-20 object-cover rounded-lg"
/>

                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Comment/Update Form Component
const CommentForm = ({ onAddComment, isSubmitting }) => {
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const commentData = {
      message,
      media: mediaFiles.map(file => URL.createObjectURL(file)) // Mock URLs for demo
    };

    await onAddComment(commentData);
    setMessage('');
    setMediaFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment about this complaint's progress..."
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          required
        />
      </div>

      {/* Media Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
        >
          <Camera className="h-4 w-4" />
          Attach Photos
        </button>
      </div>

      {/* Selected Files Preview */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
  src={URL.createObjectURL(file)}
  alt={`Preview ${index + 1}`}
  className="w-full h-20 object-cover rounded-lg"
/>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
      </button>
    </form>
  );
};

// Department Assignment Component
const DepartmentAssignment = ({ 
  complaint, 
  departments, 
  onAssign, 
  onUnassign,
  isAssigning 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(
    complaint.department?._id || ''
  );

  const handleAssign = () => {
    if (selectedDepartment && selectedDepartment !== complaint.department?._id) {
      onAssign(complaint._id || complaint.reportId, selectedDepartment);
    }
  };

  const handleUnassign = () => {
    onUnassign(complaint._id || complaint.reportId);
    setSelectedDepartment('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Department Assignment</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">No Department Assigned</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>
              {dept.name} - {dept.category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleAssign}
          disabled={!selectedDepartment || selectedDepartment === complaint.department?._id || isAssigning}
          className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isAssigning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Users className="h-4 w-4" />
          )}
          {isAssigning ? 'Assigning...' : 'Assign'}
        </button>
        
        {complaint.department && (
          <button 
            onClick={handleUnassign}
            disabled={isAssigning}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
            <UserMinus className="h-4 w-4" />
            Unassign
          </button>
        )}
      </div>
      
      {complaint.department && (
        <div className="text-sm text-white/70">
          Currently assigned to: <span className="text-white">{complaint.department.name}</span>
        </div>
      )}
    </div>
  );
};

// Complaint Detail View Component
const ComplaintDetailView = ({ 
  complaint, 
  onBack, 
  onStatusUpdate, 
  departments, 
  onAssign, 
  onUnassign,
  isAssigning,
  onAddComment 
}) => {
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleStatusUpdate = async () => {
    if (newStatus !== complaint.status) {
      setIsUpdating(true);
      try {
        await onStatusUpdate(complaint._id, newStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleAddComment = async (commentData) => {
    setIsAddingComment(true);
    try {
      await onAddComment(complaint._id, commentData);
    } finally {
      setIsAddingComment(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">Complaint Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">{safeRender(complaint.title, 'Untitled Report')}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-white/60 text-sm">Report ID:</span>
                <p className="text-white">{safeRender(complaint.reportId, 'N/A')}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Category:</span>
                <p className="text-white">{safeRender(complaint.category, 'Unknown')}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Status:</span>
                <p className="text-white capitalize">{safeRender(complaint.status, 'Unknown')}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Priority:</span>
                <p className="text-white">{safeRender(complaint.priority || complaint.urgency, 'Unknown')}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-white/60 text-sm">Description:</span>
              <p className="text-white mt-2">{safeRender(complaint.description, 'No description available')}</p>
            </div>
          </motion.div>

          {/* Location Section with Google Maps */}
          <LocationDisplay location={complaint.location} />

          {/* Media Gallery */}
          <MediaGallery media={complaint.media} />

          {/* Timeline */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
            <Timeline events={complaint.updates} />
          </motion.div>

          {/* Add Comment Section */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Add Progress Update
            </h2>
            <CommentForm onAddComment={handleAddComment} isSubmitting={isAddingComment} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Reporter Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{safeRender(complaint.reportedBy?.name, 'Anonymous')}</p>
                  <p className="text-white/60 text-sm">{safeRender(complaint.reportedBy?.email, 'No email')}</p>
                </div>
              </div>
              
              {complaint.reportedBy?.phone && (
                <div className="flex items-center gap-2 text-white/70">
                  <Phone className="h-4 w-4" />
                  <span>{complaint.reportedBy.phone}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Update */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
            <div className="space-y-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === complaint.status || isUpdating}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </motion.div>

          {/* Department Assignment */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Department Management</h3>
            <DepartmentAssignment
              complaint={complaint}
              departments={departments}
              onAssign={onAssign}
              onUnassign={onUnassign}
              isAssigning={isAssigning}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
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

  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // **UPDATED: Silent Logout handler - No alert, direct logout**
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Try to call API logout but don't fail if it errors
      try {
        await apiLogout();
      } catch (apiError) {
        console.warn('API logout failed, proceeding with local logout:', apiError);
      }
      
      // **IMPORTANT: Clear ALL localStorage data**
      localStorage.clear();
      sessionStorage.clear();
      
      // Also try to remove specific common keys if localStorage.clear() doesn't work
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userData');
      } catch (error) {
        console.warn('Error clearing individual localStorage items:', error);
      }
      
      // Navigate to login page immediately
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout process failed:', error);
      
      // Even if there's an error, clear localStorage and navigate
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

// Fetch data from backend with fallback
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // Declare placeholders
    let reportsData = [];
    let analyticsData = {};
    let userData = null;
    let departmentsData = [];
    let municipalitiesData = [];
    let staffData = [];

    // 🟢 Reports (with pagination + fallback)
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sort === "date_desc" ? "date" : filters.sort,
        sortOrder: filters.sort.includes("desc") ? "desc" : "asc",
      };

      if (filters.status !== "all") params.status = filters.status;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.priority !== "all") params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const reportsResponse = await getAllReports(params);
      reportsData =
        reportsResponse.data?.data?.reports ||
        reportsResponse.data?.data ||
        [];

      if (reportsResponse.data?.data?.totalPages) {
        setPagination({
          totalPages: reportsResponse.data.data.totalPages,
          currentPage: reportsResponse.data.data.currentPage,
          totalReports: reportsResponse.data.data.totalReports,
          hasNextPage: reportsResponse.data.data.hasNextPage,
          hasPrevPage: reportsResponse.data.data.hasPrevPage,
        });
      }
    } catch (err) {
      console.warn("Reports API not available, using fallback data:", err.message);
      reportsData = generateFallbackComplaintData();
    }

    // 🟢 Analytics
    try {
      const analyticsResponse = await getReportsAnalytics();
      analyticsData =
        analyticsResponse.data?.data?.overview ||
        analyticsResponse.data?.data ||
        {};
    } catch (err) {
      console.warn("Analytics API not available, generating from reports:", err.message);
      analyticsData = generateStatsFromComplaints(reportsData);
    }

    // 🟢 User
    try {
      const userResponse = await getCurrentUser();
      userData = userResponse.data?.data || userResponse.data;
    } catch (err) {
      console.warn("User API not available:", err.message);
      userData = { name: "Admin", email: "admin@janconnect.com" };
    }

    // 🟢 Departments
    try {
      const departmentsResponse = await getAllDepartments();
      departmentsData =
        departmentsResponse.data?.data ||
        departmentsResponse.data ||
        [];

      setDepartments(departmentsData);

      if (Array.isArray(departmentsData)) {
        const deptCategories = [...new Set(departmentsData.map((d) => d.category))];
        setCategories([
          "Infrastructure",
          "Sanitation",
          "Street Lighting",
          "Water Supply",
          "Traffic",
          "Parks",
          "Other",
          ...deptCategories,
        ]);
      }
    } catch (err) {
      console.warn("Departments API not available:", err.message);
      setCategories([
        "Infrastructure",
        "Sanitation",
        "Street Lighting",
        "Water Supply",
        "Traffic",
        "Parks",
        "Other",
      ]);

      // fallback departments
      const fallbackDepartments = [
        { _id: "dept_infra", name: "Infrastructure Department", category: "Infrastructure" },
        { _id: "dept_sanitation", name: "Sanitation Department", category: "Sanitation" },
        { _id: "dept_lighting", name: "Street Lighting Department", category: "Street Lighting" },
        { _id: "dept_water", name: "Water Supply Department", category: "Water Supply" },
        { _id: "dept_traffic", name: "Traffic Department", category: "Traffic" },
        { _id: "dept_parks", name: "Parks Department", category: "Parks" },
        { _id: "dept_other", name: "Other Issues Department", category: "Other" },
      ];
      setDepartments(fallbackDepartments);
    }

    // 🟢 Municipalities
    try {
      const municipalitiesResponse = await getAllMunicipalities();
      municipalitiesData =
        municipalitiesResponse.data?.data?.municipalities ||
        municipalitiesResponse.data?.data ||
        [];

      if (Array.isArray(municipalitiesData)) {
        const muniNames = municipalitiesData.map((m) => m.name);
        setMunicipalities(muniNames);
      } else {
        throw new Error("Invalid municipalities data");
      }
    } catch (err) {
      console.warn("Municipalities API not available:", err.message);
      setMunicipalities(["Downtown", "Suburbia", "West End"]);
    }

    // 🟢 Staff (always fallback)
    staffData = generateDummyStaffData();
    setStaffMembers(staffData);

    // ✅ Final state update
    setComplaints(reportsData);
    setStats(analyticsData);
    setUser(userData);
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    setError("Failed to load dashboard data. Using fallback data.");

    // 🔴 Full fallback in case of complete failure
    const fallbackData = generateFallbackComplaintData();
    setComplaints(fallbackData);
    setStats(generateStatsFromComplaints(fallbackData));
    setCategories([
      "Infrastructure",
      "Sanitation",
      "Street Lighting",
      "Water Supply",
      "Traffic",
      "Parks",
      "Other",
    ]);
    setMunicipalities(["Downtown", "Suburbia", "West End"]);
    setUser({ name: "Admin", email: "admin@janconnect.com" });
    setStaffMembers(generateDummyStaffData());
  } finally {
    setLoading(false);
  }
}, [filters]);

useEffect(() => {
  fetchData();
}, [fetchData]);

  // Filter and paginate complaints with better category handling
  const getFilteredComplaints = useCallback(() => {
    let filtered = [...complaints];
    
    // Apply filters
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
    
    // Apply sorting
    if (filters.sort === 'date_desc') {
      filtered.sort((a, b) => new Date(b.date || b.submittedAt) - new Date(a.date || a.submittedAt));
    } else if (filters.sort === 'date_asc') {
      filtered.sort((a, b) => new Date(a.date || a.submittedAt) - new Date(b.date || b.submittedAt));
    } else if (filters.sort === 'priority_desc') {
      filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    
    return filtered;
  }, [complaints, filters]);

  const filteredComplaints = getFilteredComplaints();

  // Event handlers
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setVisibleComplaints(5); // Reset visible complaints when filters change
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateReportStatus(complaintId, newStatus);
      
      // Update local state
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, status: newStatus }
            : c
        )
      );
      
      // Update selected complaint if it's the one being updated
      if (selectedComplaint?._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
      
      // Refresh stats
      refreshData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignToDepartment = async (complaintId, departmentId) => {
    setIsAssigning(true);
    try {
      await assignReportToDepartment(complaintId, departmentId);
      
      const department = departments.find(d => d._id === departmentId);
      
      // Update local state
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, department }
            : c
        )
      );
      
      // Update selected complaint if it's the one being updated
      if (selectedComplaint?._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, department }));
      }
      
    } catch (error) {
      console.error('Error assigning to department:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassignFromDepartment = async (complaintId) => {
    setIsAssigning(true);
    try {
      await unassignReportFromDepartment(complaintId);
      
      // Update local state
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, department: null }
            : c
        )
      );
      
      // Update selected complaint if it's the one being updated
      if (selectedComplaint?._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, department: null }));
      }
      
    } catch (error) {
      console.error('Error unassigning from department:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAddComment = async (complaintId, commentData) => {
    try {
      const response = await addComplaintComment(complaintId, commentData);
      const newComment = response.data.comment;
      
      // Update local state by adding the new comment to the complaint's updates
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { 
                ...c, 
                updates: [...(c.updates || []), {
                  id: newComment.id,
                  date: newComment.timestamp,
                  message: newComment.message,
                  updatedBy: newComment.author,
                  type: 'progress',
                  media: newComment.media
                }]
              }
            : c
        )
      );
      
      // Update selected complaint if it's the one being updated
      if (selectedComplaint?._id === complaintId) {
        setSelectedComplaint(prev => ({ 
          ...prev, 
          updates: [...(prev.updates || []), {
            id: newComment.id,
            date: newComment.timestamp,
            message: newComment.message,
            updatedBy: newComment.author,
            type: 'progress',
            media: newComment.media
          }]
        }));
      }
      
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDepartmentCreate = async (departmentData) => {
    try {
      const response = await createDepartment(departmentData);
      const newDepartment = response.data;
      
      // Update local state
      setDepartments(prev => [...prev, newDepartment]);
      
      // Update categories if new category
      if (!categories.includes(departmentData.category)) {
        setCategories(prev => [...prev, departmentData.category]);
      }
      
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleDepartmentUpdate = async (departmentId, departmentData) => {
    try {
      const response = await updateDepartment(departmentId, departmentData);
      const updatedDepartment = response.data;
      
      // Update local state
      setDepartments(prev => 
        prev.map(d => d._id === departmentId ? updatedDepartment : d)
      );
      
    } catch (error) {
      console.error('Error updating department:', error);
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

  // Export functionality from version 2
  const handleExport = () => {
    try {
      const dataToExport = filteredComplaints;
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

  return (
    <div
  className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative"
  style={{
    backgroundImage: `url('${import.meta.env.BASE_URL}images/local-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}
>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Content */}
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

                {/* Export Button from version 2 */}
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Performance Analytics
                </h2>
                <button 
                  onClick={() => setShowAnalyticsModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  View Detailed Analytics
                </button>
              </div>
              
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-2">Choose Category</label>
                <select
                style={{ color: 'white',
                  backgroundColor: 'gray',
                 }}
                  value={selectedAnalyticsCategory}
                  onChange={(e) => setSelectedAnalyticsCategory(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linear Analytics Graph */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {selectedAnalyticsCategory === 'all' ? 'All Categories' : selectedAnalyticsCategory} - Status Overview
                </h3>
                <div className="space-y-4">
                  {(() => {
                    const data = getAnalyticsData();
                    const maxValue = Math.max(data.pending, data.inProgress, data.resolved) || 1;
                    
                    return (
  <>
    {/* Pending */}
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm text-white/70">Pending</div>
      <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
        <div 
          className="h-full bg-red-300/70 transition-all duration-1000 ease-out"
          style={{ width: `${(data.pending / maxValue) * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
          {data.pending}
        </div>
      </div>
    </div>
    
    {/* In Progress */}
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm text-white/70">In Progress</div>
      <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
        <div 
          className="h-full bg-yellow-300/70 transition-all duration-1000 ease-out"
          style={{ width: `${(data.inProgress / maxValue) * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
          {data.inProgress}
        </div>
      </div>
    </div>
    
    {/* Resolved */}
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm text-white/70">Resolved</div>
      <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
        <div 
          className="h-full bg-green-300/70 transition-all duration-1000 ease-out"
          style={{ width: `${(data.resolved / maxValue) * 100}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
          {data.resolved}
        </div>
      </div>
    </div>
  </>
);
                  })()}
                </div>
              </div>
            </motion.div>

            {/* Complaints List */}
            <div className="max-w-6xl mx-auto">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Recent Complaints</h2>
                <div className="flex gap-2">
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
                    
                    {/* Load More Button */}
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
                    
                    {/* Pagination */}
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
            
            {/* <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <GoogleMapView complaints={complaints} />
            </div> */}
                        {/* Your heatmap content */}
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
      
      {/* Department Management Modal */}
      <DepartmentManagementModal
        isOpen={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        departments={departments}
        onDepartmentCreate={handleDepartmentCreate}
        onDepartmentUpdate={handleDepartmentUpdate}
        staffMembers={staffMembers}
      />

      {/* Performance Analytics Modal */}
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