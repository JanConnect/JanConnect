import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const SummaryCards = ({ stats }) => {
  const items = [
    {
      title: 'Total Reports',
      value: stats.totalReports || stats.total || 0,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Pending',
      value: stats.pendingReports || stats.pending || 0,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: 'bg-yellow-500/20'
    },
    {
      title: 'In Progress',
      value: stats.inProgressReports || stats.inProgress || 0,
      icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports || stats.resolved || 0,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      color: 'bg-green-500/20'
    },
    {
      title: 'Rejected',
      value: stats.rejectedReports || stats.rejected || 0,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      color: 'bg-red-500/20'
    }
  ];

  return (
    <motion.div
      className=" p-6 max-w-4xl mx-auto mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-white/70 text-sm">{item.title}</p>
              <p className="text-xl font-bold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SummaryCards;