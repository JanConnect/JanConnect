import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BarChart3, TrendingUp } from 'lucide-react';

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

  // Mock function - replaces with actual implementation
  const generateDepartmentAnalytics = (complaints, departments) => {
    const analytics = {};
    departments.forEach(dept => {
      analytics[dept._id] = {
        name: dept.name,
        monthlyData: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          pending: Math.floor(Math.random() * 40) + 5,
          inProgress: Math.floor(Math.random() * 50) + 10,
          resolved: Math.floor(Math.random() * 80) + 20,
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

    // Default return all summary if nothing selected
    const allData = {
      name: "IT Services",
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        pending: Math.floor(Math.random() * 40) + 5,
        inProgress: Math.floor(Math.random() * 50) + 10,
        resolved: Math.floor(Math.random() * 80) + 20,
        avgResolutionTime: 5.7
      }))
    };
    return allData;
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
      inProgressRate: totalComplaints > 0 ? ((totalInProgress / totalComplaints) * 100).toFixed(1) : 0,
      pendingRate: totalComplaints > 0 ? ((totalPending / totalComplaints) * 100).toFixed(1) : 0,
    };
  };

  const summary = calculateSummary();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100 shrink-0">
          <div className="flex gap-4 items-center">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
              <p className="text-sm text-gray-500 mt-0.5">Monthly complaint performance overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-slate-50/50">
          
          {/* Subtle Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-3 px-4 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm font-medium text-gray-500">Filters:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="department">Department</option>
              <option value="category">Category</option>
            </select>
            {selectedFilter === 'department' && (
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            )}
            {selectedFilter === 'category' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}
          </div>

          {filteredData ? (
            <>
              {/* Top Row: Stacked Chart & Radial Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Stacked Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-900">
                      {filteredData.name} — Monthly Overview
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Stacked view of complaint statuses by month</p>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium">Resolved</span>
                    </div>
                  </div>

                  <div className="relative h-64 w-full mt-4">
                    {(() => {
                      const chartData = filteredData.monthlyData;
                      const maxStack = Math.max(...chartData.map(d => d.pending + d.inProgress + d.resolved)) || 100;
                      // Generate 4 intervals for the Y axis
                      const tickMax = Math.ceil(maxStack / 45) * 45; // Match 45, 90, 135 logic from image roughly
                      const yTicks = [0, tickMax * 0.25, tickMax * 0.5, tickMax * 0.75, tickMax];
                      
                      const chartWidth = 1000;
                      const chartHeight = 250;
                      const leftMargin = 40;
                      const bottomMargin = 30;
                      const barWidth = 36;
                      const stepX = (chartWidth - leftMargin) / chartData.length;

                      const yScale = (val) => (chartHeight - bottomMargin) - (val / tickMax) * (chartHeight - bottomMargin);

                      return (
                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                          {/* Grid Lines & Labels */}
                          {yTicks.map((val, i) => (
                            <g key={`tick-${i}`}>
                              <line 
                                x1={leftMargin} 
                                y1={yScale(val)} 
                                x2={chartWidth} 
                                y2={yScale(val)} 
                                stroke="#f3f4f6" 
                                strokeWidth="1" 
                                strokeDasharray="4 4" 
                              />
                              <text 
                                x={leftMargin - 10} 
                                y={yScale(val) + 4} 
                                textAnchor="end" 
                                className="text-xs fill-gray-400 font-medium"
                              >
                                {Math.round(val)}
                              </text>
                            </g>
                          ))}

                          {/* Bars */}
                          {chartData.map((d, i) => {
                            const x = leftMargin + (i * stepX) + (stepX - barWidth) / 2;
                            
                            const pendingHeight = ((chartHeight - bottomMargin) * d.pending) / tickMax;
                            const progressHeight = ((chartHeight - bottomMargin) * d.inProgress) / tickMax;
                            const resolvedHeight = ((chartHeight - bottomMargin) * d.resolved) / tickMax;

                            const pendingY = yScale(d.pending);
                            const progressY = yScale(d.pending + d.inProgress);
                            const resolvedY = yScale(d.pending + d.inProgress + d.resolved);

                            return (
                              <g key={`bar-${i}`}>
                                {/* Pending (Red) */}
                                {pendingHeight > 0 && (
                                  <rect x={x} y={pendingY} width={barWidth} height={pendingHeight} fill="#ef4444" />
                                )}
                                {/* In Progress (Yellow) */}
                                {progressHeight > 0 && (
                                  <rect x={x} y={progressY} width={barWidth} height={progressHeight} fill="#f59e0b" />
                                )}
                                {/* Resolved (Green) with rounded top */}
                                {resolvedHeight > 0 && (
                                  <>
                                    <rect x={x} y={resolvedY} width={barWidth} height={resolvedHeight} fill="#22c55e" rx={4} />
                                    {/* Cover bottom rounded corners if it sits on top of others */}
                                    {(pendingHeight > 0 || progressHeight > 0) && (
                                      <rect x={x} y={resolvedY + 4} width={barWidth} height={Math.max(0, resolvedHeight - 4)} fill="#22c55e" />
                                    )}
                                  </>
                                )}
                                
                                {/* X-Axis Label */}
                                <text 
                                  x={x + barWidth / 2} 
                                  y={chartHeight - 5} 
                                  textAnchor="middle" 
                                  className="text-xs fill-gray-500 font-medium"
                                >
                                  {d.month}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* Distribution Radial Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col items-center">
                  <div className="text-center mb-6">
                    <h3 className="text-base font-semibold text-gray-900">Distribution</h3>
                    <p className="text-sm text-gray-500 mt-1">Status breakdown</p>
                  </div>

                  <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                    {(() => {
                      const radiusRed = 80;
                      const radiusYellow = 60;
                      const radiusGreen = 40;
                      
                      const strokeWidth = 14;
                      const center = 100;
                      
                      // Max percentage establishes the longest arc (full track)
                      const maxPct = Math.max(summary.resolutionRate, summary.inProgressRate, summary.pendingRate);
                      
                      // Calculate Dash Arrays (Circumferences)
                      const cRed = 2 * Math.PI * radiusRed;
                      const cYellow = 2 * Math.PI * radiusYellow;
                      const cGreen = 2 * Math.PI * radiusGreen;

                      // 75% of circle is the track length, leaving a 25% gap at bottom
                      const trackFraction = 0.75;
                      
                      // Calculate fill length relative to the max value
                      const fillRed = (summary.pendingRate / maxPct) * (trackFraction * cRed);
                      const fillYellow = (summary.inProgressRate / maxPct) * (trackFraction * cYellow);
                      const fillGreen = (summary.resolutionRate / maxPct) * (trackFraction * cGreen);

                      return (
                        <svg className="w-full h-full transform rotate-[135deg]" viewBox="0 0 200 200">
                          {/* Background Tracks */}
                          <circle cx={center} cy={center} r={radiusRed} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${trackFraction * cRed} ${cRed}`} />
                          <circle cx={center} cy={center} r={radiusYellow} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${trackFraction * cYellow} ${cYellow}`} />
                          <circle cx={center} cy={center} r={radiusGreen} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${trackFraction * cGreen} ${cGreen}`} />

                          {/* Data Arcs */}
                          {/* Red (Pending) - Outer */}
                          <circle cx={center} cy={center} r={radiusRed} fill="none" stroke="#ef4444" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${fillRed} ${cRed}`} className="transition-all duration-1000 ease-out" />
                          {/* Yellow (In Progress) - Middle */}
                          <circle cx={center} cy={center} r={radiusYellow} fill="none" stroke="#f59e0b" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${fillYellow} ${cYellow}`} className="transition-all duration-1000 ease-out" />
                          {/* Green (Resolved) - Inner */}
                          <circle cx={center} cy={center} r={radiusGreen} fill="none" stroke="#22c55e" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${fillGreen} ${cGreen}`} className="transition-all duration-1000 ease-out" />
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Legend/Stats */}
                  <div className="w-full space-y-3 mt-auto">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Resolved</span>
                      </div>
                      <span className="font-semibold text-gray-900">{summary.resolutionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                        <span className="text-gray-600">In Progress</span>
                      </div>
                      <span className="font-semibold text-gray-900">{summary.inProgressRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Pending</span>
                      </div>
                      <span className="font-semibold text-gray-900">{summary.pendingRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Resolution Rate */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-gray-900">Resolution Rate</span>
                  </div>
                  <span className="text-sm text-gray-500">Avg resolution: {summary.avgResolutionTime} days</span>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${summary.resolutionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                   <span className="text-sm font-bold text-indigo-600">{summary.resolutionRate}%</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PerformanceAnalyticsModal;