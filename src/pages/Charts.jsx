// components/Charts.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useTranslation } from "react-i18next";
import { BarChart3, TrendingUp } from "lucide-react";

// Custom Tooltip for Bar Chart
export const CustomBarTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <p className="font-bold text-white text-sm mb-4 border-b border-white/10 pb-2 text-shadow-sm">
          {label}
        </p>
        <div className="space-y-5 rounded-xl">
          {/* Resolved */}
          <div className="flex justify-between items-center">
            <span className="text-green-300 text-sm text-shadow-sm">
              {t("resolved")}
            </span>
            <span className="text-white font-semibold text-shadow-sm">
              {data.resolved}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all duration-500"
              style={{ width: `${data.resolved}%` }}
            />
          </div>

          {/* Pending */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-yellow-300 text-sm text-shadow-sm">
              {t("pending")}
            </span>
            <span className="text-white font-semibold text-shadow-sm">
              {data.pending}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-500"
              style={{ width: `${data.pending}%` }}
            />
          </div>

          {/* Avg Time */}
          <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/10">
            <span className="text-blue-300 text-sm text-shadow-sm">
              {t("avgTime")}
            </span>
            <span className="text-white font-semibold text-shadow-sm">
              {data.avgTime}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Line Chart
export const CustomLineTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] p-4 flex flex-col space-y-2">
        <p className="text-white font-bold text-sm text-shadow-md">{label}</p>
        <p className="text-blue-400 text-sm text-shadow-sm">
          {t("reports")}: {payload[0].value}
        </p>
        <p className="text-green-400 text-sm text-shadow-sm">
          {t("resolved")}: {payload[1].value}
        </p>
        <p className="text-gray-300 text-sm">
          {t("resolution Rate")}
          <span className="font-semibold text-white text-shadow-sm">
            {payload[0].value
              ? Math.round((payload[1].value / payload[0].value) * 100)
              : 0}
            %
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Department Performance Chart Component
export const DepartmentPerformanceChart = ({ data }) => {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        barSize={35}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient
            id="resolvedGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#34D399" stopOpacity={0.9} />
            <stop
              offset="100%"
              stopColor="#10B981"
              stopOpacity={0.6}
            />
          </linearGradient>
          <linearGradient
            id="pendingGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.9} />
            <stop
              offset="100%"
              stopColor="#F59E0B"
              stopOpacity={0.6}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.1)"
          vertical={false}
        />
        <XAxis
          dataKey="department"
          textAnchor="end"
          height={60}
          tick={{
            fill: "rgba(255,255,255,0.8)",
            fontSize: 12,
            fontWeight: 500,
          }}
          interval={0}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
          label={{
            value: `${t('resolutionRate', { defaultValue: 'Resolution Rate' })} (%)`,
            angle: -90,
            position: "insideLeft",
            style: {
              fill: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontWeight: 500,
            },
          }}
          domain={[0, 100]}
        />
        <Tooltip
          content={<CustomBarTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.1)" }}
        />

        {/* Bars with gradient */}
        <Bar
          dataKey="resolved"
          name="Resolved"
          fill="url(#resolvedGradient)"
          radius={[6, 6, 0, 0]}
          background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
        />
        <Bar
          dataKey="pending"
          name="Pending"
          fill="url(#pendingGradient)"
          radius={[6, 6, 0, 0]}
          background={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Reports Timeline Chart Component
export const ReportsTimelineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.1)"
        />
        <XAxis
          dataKey="month"
          tick={{ fill: "rgba(255,255,255,0.7)" }}
        />
        <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
        <Tooltip content={<CustomLineTooltip />} />
        <Legend
          wrapperStyle={{
            color: "rgba(255,255,255,0.7)",
            paddingTop: "20px",
          }}
        />
        <Line
          type="monotone"
          dataKey="reports"
          name="Total Reports"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ r: 4, fill: "#3B82F6" }}
          activeDot={{ r: 6, fill: "#3B82F6" }}
        />
        <Line type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981" }} activeDot={{ r: 6, fill: "#10B981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Analytics Charts Section Component
export const AnalyticsChartsSection = ({ 
  departmentPerformanceData, 
  reportsOverTimeData,
  activeChartTab,
  setActiveChartTab
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full p-4 mt-8 relative z-10">
      <div className=" backdrop-blur-md rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t("performanceAnalytics")}
          </h2>
          <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveChartTab("department")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                activeChartTab === "department"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-transparent text-white/70 hover:bg-white/10"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {t("departmentPerformance")}
            </button>
            <button
              onClick={() => setActiveChartTab("reports")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                activeChartTab === "reports"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-transparent text-white/70 hover:bg-white/10"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("reportsTimeline")}
            </button>
          </div>
        </div>

        <div className="h-80">
          {activeChartTab === "department" ? (
            <DepartmentPerformanceChart data={departmentPerformanceData} />
          ) : (
            <ReportsTimelineChart data={reportsOverTimeData} />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center items-center text-center mt-6">
        <h1 className="text-[5vw] md:text-[3vw] font-bold text-white">
          {t("liveComplaintsHeatmap")}
        </h1>
      </div>
    </div>
  );
};