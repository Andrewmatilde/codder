import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  // Ensure valid values
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  
  if (safeTotalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, safeCurrentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(safeTotalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page !== safeCurrentPage && page >= 1 && page <= safeTotalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className="pagination">
      <div className="pagination-info">
        Showing page <span>{safeCurrentPage}</span> of{' '}
        <span>{safeTotalPages}</span>
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={`pagination-button pagination-button-prev ${
            safeCurrentPage === 1 ? 'disabled' : ''
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`pagination-button ${
              safeCurrentPage === number ? 'pagination-button-active' : ''
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className={`pagination-button pagination-button-next ${
            safeCurrentPage === safeTotalPages ? 'disabled' : ''
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination; 