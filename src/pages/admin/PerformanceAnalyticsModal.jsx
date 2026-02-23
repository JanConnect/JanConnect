import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Mock function - replace with actual implementation
  const generateDepartmentAnalytics = (complaints, departments) => {
    const analytics = {};
    departments.forEach(dept => {
      analytics[dept._id] = {
        name: dept.name,
        monthlyData: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          pending: Math.floor(Math.random() * 50),
          inProgress: Math.floor(Math.random() * 60),
          resolved: Math.floor(Math.random() * 100),
          avgResolutionTime: Math.floor(Math.random() * 10) + 2
        }))
      };
    });
    return analytics;
  };

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
              monthData.avgResolutionTime += deptMonth.avgResolutionTime;
            }
          });
          
          if (deptIds.length > 0) {
            monthData.avgResolutionTime = monthData.avgResolutionTime / deptIds.length;
          }
          
          return monthData;
        })
      };
      
      return combinedData;
    }
    
    return null;
  };

  const filteredData = getFilteredData();

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!filteredData) return null;
    
    const totalPending = filteredData.monthlyData.reduce((sum, month) => sum + month.pending, 0);
    const totalInProgress = filteredData.monthlyData.reduce((sum, month) => sum + month.inProgress, 0);
    const totalResolved = filteredData.monthlyData.reduce((sum, month) => sum + month.resolved, 0);
    const totalComplaints = totalPending + totalInProgress + totalResolved;
    
    const avgResolutionTime = filteredData.monthlyData.reduce((sum, month) => sum + month.avgResolutionTime, 0) / 12;
    
    return {
      totalComplaints,
      totalResolved,
      totalPending,
      totalInProgress,
      avgResolutionTime: avgResolutionTime.toFixed(1),
      resolutionRate: totalComplaints > 0 ? ((totalResolved / totalComplaints) * 100).toFixed(1) : 0,
    };
  };

  const summary = calculateSummary();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  Performance Analytics
                </span>
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Monthly complaint performance overview
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition"
            >
              <X className="h-5 w-5 text-white/60 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">View By</label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all hover:bg-white/10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' strokeOpacity='0.5'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5rem',
                }}
              >
                <option value="department" className="bg-[#1e293b]">Department</option>
                <option value="category" className="bg-[#1e293b]">Category</option>
              </select>
            </div>

            {selectedFilter === 'department' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Select Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all hover:bg-white/10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' strokeOpacity='0.5'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem',
                  }}
                >
                  <option value="all" className="bg-[#1e293b]">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id} className="bg-[#1e293b]">
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all hover:bg-white/10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' strokeOpacity='0.5'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem',
                  }}
                >
                  <option value="all" className="bg-[#1e293b]">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-[#1e293b]">
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
              {/* Summary Cards */}
              {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { 
                      label: 'Total', 
                      value: summary.totalComplaints, 
                      icon: <BarChart3 className="h-4 w-4 text-indigo-400" />,
                      bg: 'from-indigo-500/10 to-indigo-600/5',
                      border: 'border-indigo-500/20'
                    },
                    { 
                      label: 'Resolved', 
                      value: summary.totalResolved, 
                      icon: <CheckCircle className="h-4 w-4 text-green-400" />,
                      bg: 'from-green-500/10 to-green-600/5',
                      border: 'border-green-500/20'
                    },
                    { 
                      label: 'In Progress', 
                      value: summary.totalInProgress, 
                      icon: <AlertCircle className="h-4 w-4 text-yellow-400" />,
                      bg: 'from-yellow-500/10 to-yellow-600/5',
                      border: 'border-yellow-500/20'
                    },
                    { 
                      label: 'Pending', 
                      value: summary.totalPending, 
                      icon: <Clock className="h-4 w-4 text-red-400" />,
                      bg: 'from-red-500/10 to-red-600/5',
                      border: 'border-red-500/20'
                    },
                    { 
                      label: 'Avg Days', 
                      value: summary.avgResolutionTime, 
                      icon: <TrendingUp className="h-4 w-4 text-purple-400" />,
                      bg: 'from-purple-500/10 to-purple-600/5',
                      border: 'border-purple-500/20'
                    }
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`bg-gradient-to-br ${stat.bg} rounded-xl p-4 border ${stat.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white/50 text-xs mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                          {stat.icon}
                        </div>
                      </div>
                      {stat.label === 'Resolved' && (
                        <div className="mt-2">
                          <span className="text-xs text-green-400">{summary.resolutionRate}% rate</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Chart Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></span>
                      {filteredData.name} - Monthly Trends
                    </h3>
                    <p className="text-white/40 text-sm mt-1">Complaint status progression over time</p>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex gap-4">
                    {[
                      { color: "bg-red-500", text: "Pending" },
                      { color: "bg-yellow-500", text: "In Progress" },
                      { color: "bg-green-500", text: "Resolved" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${item.color} rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                        <span className="text-xs text-white/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Container */}
                <div className="relative h-80 w-full bg-gradient-to-br from-[#0f172a]/50 to-[#1e293b]/50 rounded-xl p-4 border border-white/5">
                  {(() => {
                    const chartData = filteredData.monthlyData.map(d => ({
                      month: d.month,
                      pending: d.pending,
                      inProgress: d.inProgress,
                      resolved: d.resolved
                    }));

                    const maxValue = Math.max(
                      ...chartData.flatMap(d => [d.pending, d.inProgress, d.resolved])
                    ) || 100;

                    const chartWidth = 700;
                    const chartHeight = 250;
                    const stepX = chartWidth / (chartData.length - 1);
                    const leftMargin = 50;
                    const topMargin = 20;
                    const bottomMargin = 30;

                    const yScale = (val) => topMargin + (chartHeight - bottomMargin) - (val / maxValue) * (chartHeight - topMargin - bottomMargin);

                    // Create paths for each line
                    const createPath = (key) => {
                      let path = "";
                      chartData.forEach((d, i) => {
                        const x = leftMargin + i * stepX;
                        const y = yScale(d[key]);
                        path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
                      });
                      return path;
                    };

                    return (
                      <>
                        {/* Grid lines */}
                        <div className="absolute inset-0 left-12 right-8 top-4 bottom-8">
                          {[0, 25, 50, 75, 100].map((val, i) => {
                            const y = yScale(val * maxValue / 100);
                            return (
                              <div
                                key={i}
                                className="absolute left-0 right-0 border-t border-white/5"
                                style={{ top: y }}
                              >
                                <span className="absolute -left-8 -top-2 text-xs text-white/30">
                                  {val}%
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* SVG for lines */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          {/* Gradient definitions */}
                          <defs>
                            <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
                            </linearGradient>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#eab308" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#eab308" stopOpacity="0.05" />
                            </linearGradient>
                            <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>

                          {/* Area under pending line */}
                          <path
                            d={`${createPath('pending')} L${leftMargin + (chartData.length - 1) * stepX},${chartHeight - bottomMargin} L${leftMargin},${chartHeight - bottomMargin} Z`}
                            fill="url(#pendingGradient)"
                            opacity="0.8"
                          />

                          {/* Area under inProgress line */}
                          <path
                            d={`${createPath('inProgress')} L${leftMargin + (chartData.length - 1) * stepX},${chartHeight - bottomMargin} L${leftMargin},${chartHeight - bottomMargin} Z`}
                            fill="url(#progressGradient)"
                            opacity="0.8"
                          />

                          {/* Area under resolved line */}
                          <path
                            d={`${createPath('resolved')} L${leftMargin + (chartData.length - 1) * stepX},${chartHeight - bottomMargin} L${leftMargin},${chartHeight - bottomMargin} Z`}
                            fill="url(#resolvedGradient)"
                            opacity="0.8"
                          />

                          {/* Pending line */}
                          <path
                            d={createPath('pending')}
                            stroke="#ef4444"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-lg"
                          />

                          {/* In Progress line */}
                          <path
                            d={createPath('inProgress')}
                            stroke="#eab308"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-lg"
                          />

                          {/* Resolved line */}
                          <path
                            d={createPath('resolved')}
                            stroke="#22c55e"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-lg"
                          />

                          {/* Data points for all lines */}
                          {['pending', 'inProgress', 'resolved'].map((key, lineIdx) => (
                            chartData.map((d, i) => {
                              const x = leftMargin + i * stepX;
                              const y = yScale(d[key]);
                              return (
                                <g key={`${key}-${i}`}>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill={key === 'pending' ? '#ef4444' : key === 'inProgress' ? '#eab308' : '#22c55e'}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint({ 
                                      month: d.month, 
                                      type: key === 'pending' ? 'Pending' : key === 'inProgress' ? 'In Progress' : 'Resolved', 
                                      value: d[key] 
                                    })}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                  />
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="10"
                                    fill="white"
                                    fillOpacity="0.1"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint({ 
                                      month: d.month, 
                                      type: key === 'pending' ? 'Pending' : key === 'inProgress' ? 'In Progress' : 'Resolved', 
                                      value: d[key] 
                                    })}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                  />
                                </g>
                              );
                            })
                          ))}
                        </svg>

                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-12 right-8 flex justify-between text-xs">
                          {filteredData.monthlyData.map((month, i) => (
                            <span key={month.month} className="text-white/40">
                              {month.month}
                            </span>
                          ))}
                        </div>

                        {/* Tooltip */}
                        {hoveredPoint && (
                          <div
                            className="absolute bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 shadow-xl z-10"
                            style={{
                              left: leftMargin + chartData.findIndex(d => d.month === hoveredPoint.month) * stepX - 30,
                              top: yScale(chartData.find(d => d.month === hoveredPoint.month)?.[
                                hoveredPoint.type === 'Pending' ? 'pending' : 
                                hoveredPoint.type === 'In Progress' ? 'inProgress' : 'resolved'
                              ] || 0) - 40
                            }}
                          >
                            <p className="text-white text-xs font-bold">{hoveredPoint.month}</p>
                            <p className="text-xs" style={{
                              color: hoveredPoint.type === 'Pending' ? '#ef4444' : 
                                     hoveredPoint.type === 'In Progress' ? '#eab308' : '#22c55e'
                            }}>
                              {hoveredPoint.type}: {hoveredPoint.value}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Resolution Rate Indicator */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm text-white/60">Resolution Rate</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      parseFloat(summary?.resolutionRate || 0) >= 70 ? 'bg-green-500/20 text-green-400' :
                      parseFloat(summary?.resolutionRate || 0) >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {summary?.resolutionRate}%
                    </span>
                  </div>
                  <div className="text-xs text-white/40">
                    Avg resolution: {summary?.avgResolutionTime} days
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-indigo-400/50" />
              </div>
              <p className="text-white/60 text-lg">Select a department or category to view analytics</p>
              <p className="text-white/20 text-sm mt-2">Choose from the filters above to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
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
          0% { r: 5; opacity: 0.8; }
          50% { r: 8; opacity: 0.4; }
          100% { r: 5; opacity: 0.8; }
        }
        
        .dot:hover {
          r: 8;
          transition: r 0.2s ease;
        }
        
        #data-tooltip {
          z-index: 9999 !important;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default PerformanceAnalyticsModal;