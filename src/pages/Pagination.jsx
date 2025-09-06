import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, loading = false }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous Button */}
      <motion.button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-white/20 text-white transition-all duration-200"
        whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
        whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <motion.button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={loading}
          className={`px-4 py-2 rounded-xl border border-white/20 transition-all duration-200 min-w-[40px] ${
            page === currentPage
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          whileHover={{ scale: page !== currentPage ? 1.05 : 1 }}
          whileTap={{ scale: page !== currentPage ? 0.95 : 1 }}
        >
          {page}
        </motion.button>
      ))}

      {/* Next Button */}
      <motion.button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-white/20 text-white transition-all duration-200"
        whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
        whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

export default Pagination;
