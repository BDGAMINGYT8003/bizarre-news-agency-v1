
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Only hide if there are no pages at all (e.g. no articles found in a search)
  if (totalPages < 1) {
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
    <nav aria-label="Article navigation" className="flex justify-center items-center space-x-4 mt-7 -mb-1">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left"></i>
        <span>পূর্ববর্তী</span>
      </button>

      <span className="text-gray-400 font-medium">
        পৃষ্ঠা {currentPage} / {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        aria-label="Next page"
      >
        <span>পরবর্তী</span>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </nav>
  );
};

export default Pagination;
