import React from 'react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  return (
    <motion.nav 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center space-x-6 mt-16 mb-4"
        aria-label="Article navigation"
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="w-12 h-12 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 disabled:opacity-30 disabled:hover:bg-surfaceHighlight disabled:hover:text-gray-400 transition-all duration-300"
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white font-sans">{currentPage}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">of {totalPages}</span>
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="w-12 h-12 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:border-purple-500 disabled:opacity-30 disabled:hover:bg-surfaceHighlight disabled:hover:text-gray-400 transition-all duration-300"
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </motion.nav>
  );
};

export default Pagination;