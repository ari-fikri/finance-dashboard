import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  goToPage,
  setRecordsPerPage,
  recordsPerPage,
  totalRecords,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
      }}
    >
      <div>
        <label htmlFor="recordsPerPage" style={{ fontSize: 12, marginRight: 8 }}>
          Rows per page:
        </label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid #d1d5db',
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span style={{ fontSize: 12, marginLeft: 12, color: '#6b7280' }}>
          Total {totalRecords} records
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-ghost"
          style={{
            padding: '4px 8px',
            fontSize: 12,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Prev
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={
              page === currentPage ? 'btn btn-primary' : 'btn btn-ghost'
            }
            style={{
              padding: '4px 8px',
              fontSize: 12,
              minWidth: 32,
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-ghost"
          style={{
            padding: '4px 8px',
            fontSize: 12,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;