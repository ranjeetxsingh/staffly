import React from 'react';
import PropTypes from 'prop-types';

/**
 * Pagination Component
 * Page navigation
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 5,
  showFirstLast = true,
  className = '',
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisible);
    }

    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          First
        </button>
      )}

      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === 1
            ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-dark-900 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers[0] > 1 && (
        <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            page === currentPage
              ? 'text-white bg-primary-600 hover:bg-primary-700'
              : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-dark-900 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
        }`}
      >
        Next
      </button>

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          Last
        </button>
      )}
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  maxVisible: PropTypes.number,
  showFirstLast: PropTypes.bool,
  className: PropTypes.string,
};

export default Pagination;
