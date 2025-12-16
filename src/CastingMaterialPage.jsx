import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './components/Pagination';

const CastingMaterialPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetch('/Casting Material.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const formatValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === '-') {
      return String(value).trim();
    }
    const num = Number(String(value).replace(/\./g, '').replace(',', '.'));
    if (!isNaN(num)) {
      if (String(value).includes(',')) {
        return num.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
      }
      return num.toLocaleString('de-DE');
    }
    return value;
  };

  const getCleanValue = (val) => (val && String(val).trim() !== '' ? String(val).trim() : '');

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading data: {error.message}</div>;
  }

  if (data.length === 0) {
    return <div className="p-4">No data available.</div>;
  }

  const dataWithRowSpans = [];
  const rows = data.slice(1);
  let i = 0;
  while (i < rows.length) {
    let j = i;
    while (j < rows.length && rows[j]['Casting Part'] === rows[i]['Casting Part'] && rows[j]['CC'] === rows[i]['CC']) {
      j++;
    }
    const rowSpan = j - i;
    for (let k = i; k < j; k++) {
      dataWithRowSpans.push({
        ...rows[k],
        rowSpan: k === i ? rowSpan : 0,
        isFirstOfGroup: k === i
      });
    }
    i = j;
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dataWithRowSpans.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(dataWithRowSpans.length / recordsPerPage);

  const goToPage = (page) => {
    if (page > 0 && page <= nPages) {
      setCurrentPage(page);
    }
  };

  const recordsToRender = [];
  if (currentRecords.length > 0) {
    let i = 0;
    while (i < currentRecords.length) {
      let j = i;
      while (j < currentRecords.length &&
             currentRecords[j]['Casting Part'] === currentRecords[i]['Casting Part'] &&
             currentRecords[j]['CC'] === currentRecords[i]['CC']) {
        j++;
      }
      const pageGroupSize = j - i;
      for (let k = i; k < j; k++) {
        recordsToRender.push({
          ...currentRecords[k],
          rowSpan: k === i ? pageGroupSize : 0,
          isFirstOfGroup: k === i,
        });
      }
      i = j;
    }
  }

  return (
    <div style={{ background: "#fff", padding: "16px", position: "relative" }}>
      <Link
        to="/"
        className="btn"
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          textDecoration: "none",
          color: "#000",
          fontSize: "16px",
          fontWeight: "bold",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        X
      </Link>
      <div className="app-header" style={{ marginBottom: '1rem' }}>
        <h1 className="text-2xl font-bold">Casting Material</h1>
      </div>
      <div style={{ overflowX: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th rowSpan="2" className="tbl-header">No</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>EG Model</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>Category</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>Casting Part</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>CC</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>Material No</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>Material Name</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1' }}>Material Category</th>
              <th colSpan="3" className="tbl-header" style={{ background: '#a8d8f1' }}>Oct'24-Mar'25</th>
              <th colSpan="3" className="tbl-header" style={{ background: '#a8d8f1' }}>Apr-Sep'25</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#be5014', color: 'white' }}>Diff Amount</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#be5014', color: 'white' }}>Diff %</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#be5014', color: 'white' }}>Material Price Impact</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#be5014', color: 'white' }}>Gentani Impact</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#bbfebb' }}>Remark</th>
            </tr>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Price</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Gentani</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Total</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Price</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Gentani</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {recordsToRender.map((row, index) => {
              const remark = getCleanValue(row['Remark']);
              const rowStyle = remark === 'New Material' ? { backgroundColor: '#eaf5e9' } : {};
              const diffAmountStyle = remark === 'delete material' ? { backgroundColor: '#eaf5e9' } : {};
              const gentaniImpactStyle = remark === 'Increasing gentani' ? { backgroundColor: '#eaf5e9' } : {};

              const cellStyle = { border: '1px solid #e5e7eb', textAlign: 'left', padding: '6px' };
              const rightCellStyle = { ...cellStyle, textAlign: 'right' };
              const centerCellStyle = { ...cellStyle, textAlign: 'center' };

              return (
                <tr key={indexOfFirstRecord + index} style={{...rowStyle, borderBottom: '1px solid #e5e7eb'}}>
                  <td className="td-default" style={centerCellStyle}>{indexOfFirstRecord + index + 1}</td>
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['EG Model'])}</td>
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['Category'])}</td>
                  {row.isFirstOfGroup && (
                    <>
                      <td rowSpan={row.rowSpan} className="td-default" style={{...cellStyle, backgroundColor: '#eaf5e9', verticalAlign: 'top'}}>{getCleanValue(row['Casting Part'])}</td>
                      <td rowSpan={row.rowSpan} className="td-default" style={{...cellStyle, backgroundColor: '#eaf5e9', verticalAlign: 'top'}}>{getCleanValue(row['CC'])}</td>
                    </>
                  )}
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['Material No'])}</td>
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['Material Name'])}</td>
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['Material Category'])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Oct'24-Mar'25"][0])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Oct'24-Mar'25"][1])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Oct'24-Mar'25"][2])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Apr-Sep'25"][0])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Apr-Sep'25"][1])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row["Apr-Sep'25"][2])}</td>
                  <td className="td-default" style={{...rightCellStyle, ...diffAmountStyle}}>{formatValue(row['Diff Amount'])}</td>
                  <td className="td-default" style={rightCellStyle}>{getCleanValue(row['Diff %'])}</td>
                  <td className="td-default" style={cellStyle}>{getCleanValue(row['Material Price Impact'])}</td>
                  <td className="td-default" style={{...cellStyle, ...gentaniImpactStyle}}>{getCleanValue(row['Gentani Impact'])}</td>
                  <td className="td-default" style={cellStyle}>{remark}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={nPages}
        goToPage={goToPage}
        totalRecords={dataWithRowSpans.length}
        startIndex={indexOfFirstRecord}
        endIndex={indexOfLastRecord}
      />
    </div>
  );
};

export default CastingMaterialPage;