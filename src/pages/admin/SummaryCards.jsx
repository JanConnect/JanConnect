import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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

export default SummaryCards;