import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BarChart3 } from 'lucide-react';
import { generateDepartmentAnalytics } from '../../utils/mockData';

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
                style={{ color: 'white', backgroundColor: 'gray' }}
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
                  style={{ color: 'white', backgroundColor: 'gray' }}
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
                  style={{ color: 'white', backgroundColor: 'gray' }}
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
                    <h4 className="text-white/90 text-lg font-semibold">Monthly Progress</h4>
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

export default PerformanceAnalyticsModal;