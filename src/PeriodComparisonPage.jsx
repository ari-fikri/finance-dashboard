import React, { useState, useMemo } from 'react';
import { useComparisonData } from './hooks/useComparisonData';
import ComparisonHeader from './components/ComparisonHeader';
import ComparisonTable from './components/ComparisonTable';
import Pagination from './components/Pagination';
import { pprDataByPeriod } from "./data/pprSampleData";

const exchangeRates = {
  'Aug-25': '15,650',
  'Jul-25': '15,420',
  'Jun-25': '15,890',
};

function PeriodComparisonPage() {
  const {
    rows,
    comparedMonth1,
    comparedMonth2,
    handleCompare,
  } = useComparisonData(pprDataByPeriod);

  const [selectedMonth, setSelectedMonth] = useState('Jul-25');
  const [selectedMonth2, setSelectedMonth2] = useState('Aug-25');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [threshold, setThreshold] = useState(10);
  const [remarkValues, setRemarkValues] = useState({});

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = useMemo(
    () => rows.slice(indexOfFirstRecord, indexOfLastRecord),
    [rows, indexOfFirstRecord, indexOfLastRecord]
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const isOutsideThreshold = (diff) => {
    return Math.abs(diff) > threshold;
  };

  const getRemarkValue = (partNo, originalRemark) => {
    return remarkValues[partNo] !== undefined
      ? remarkValues[partNo]
      : originalRemark;
  };

  const handleRemarkSave = (partNo, value) => {
    setRemarkValues((prev) => ({ ...prev, [partNo]: value }));
  };

  const handleDetailClick = (partNo) => {
    alert(`Detail view for Part: ${partNo}`);
  };

  const getDiffStyle = (diffValue, baseStyle) => {
    if (diffValue !== null && isOutsideThreshold(diffValue)) {
      return { ...baseStyle, color: 'red', fontWeight: 'bold' };
    }
    return baseStyle;
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: '95vw', margin: '0 auto' }}>
        <ComparisonHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedMonth2={selectedMonth2}
          setSelectedMonth2={setSelectedMonth2}
          handleCompare={(month1, month2) => {
            handleCompare(month1, month2);
            setCurrentPage(1);
          }}
          comparedMonth1={comparedMonth1}
          comparedMonth2={comparedMonth2}
          exchangeRates={exchangeRates}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="threshold" style={{ fontSize: 12 }}>
              Threshold (%):
            </label>
            <input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{
                width: 60,
                padding: '4px 8px',
                fontSize: 12,
                borderRadius: 4,
                border: '1px solid #d1d5db',
              }}
            />
          </div>
        </div>

        <ComparisonTable
          currentRecords={currentRecords}
          getDiffStyle={getDiffStyle}
          handleDetailClick={handleDetailClick}
          getRemarkValue={getRemarkValue}
          handleRemarkSave={handleRemarkSave}
          comparedMonth1={comparedMonth1}
          comparedMonth2={comparedMonth2}
        />

        {rows.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            setRecordsPerPage={(value) => {
              setRecordsPerPage(value);
              setCurrentPage(1);
            }}
            recordsPerPage={recordsPerPage}
            totalRecords={rows.length}
          />
        )}
      </div>
    </div>
  );
}

export default PeriodComparisonPage;