import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  goToPage,
  totalRecords,
  startIndex,
  endIndex,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const itemsPerPageOptions = [5, 10, 25, 50, 100];

  return (
    <div
      style={{
        marginTop: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{" "}
          {totalRecords} records
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 13, color: "#6b7280" }}>per page</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-ghost"
          style={{
            padding: "4px 8px",
            fontSize: 12,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={page === currentPage ? "btn btn-primary" : "btn btn-ghost"}
            style={{
              padding: "4px 8px",
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
            padding: "4px 8px",
            fontSize: 12,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;