import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './components/Pagination';
import ExcelJS from 'exceljs';
import CastingMaterialHeader from './components/CastingMaterialHeader';

const CastingMaterialPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Casting Material');

    const parseValueForExcel = (value) => {
      if (value === null || value === undefined || String(value).trim() === '-') {
        return null;
      }
      const num = Number(String(value).replace(/\./g, '').replace(',', '.'));
      return isNaN(num) ? value : num;
    };

    // Header Row 1
    worksheet.addRow([
      'No', 'EG Model', 'Category', 'Casting Part', 'CC', 'Material No', 'Material Name', 'Material Category',
      "Oct'24-Mar'25", null, null,
      "Apr-Sep'25", null, null,
      'Diff Amount', 'Diff %', 'Material Price Impact', 'Gentani Impact', 'Remark'
    ]);

    // Header Row 2
    worksheet.addRow([
      null, null, null, null, null, null, null, null,
      'Price', 'Gentani', 'Total',
      'Price', 'Gentani', 'Total',
      null, null, null, null, null
    ]);

    // Merging cells for headers
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:C2');
    worksheet.mergeCells('D1:D2');
    worksheet.mergeCells('E1:E2');
    worksheet.mergeCells('F1:F2');
    worksheet.mergeCells('G1:G2');
    worksheet.mergeCells('H1:H2');
    worksheet.mergeCells('I1:K1'); // Oct'24-Mar'25
    worksheet.mergeCells('L1:N1'); // Apr-Sep'25
    worksheet.mergeCells('O1:O2');
    worksheet.mergeCells('P1:P2');
    worksheet.mergeCells('Q1:Q2');
    worksheet.mergeCells('R1:R2');
    worksheet.mergeCells('S1:S2');

    // Sub-headers for periods
    worksheet.getCell('I2').value = 'Price';
    worksheet.getCell('J2').value = 'Gentani';
    worksheet.getCell('K2').value = 'Total';
    worksheet.getCell('L2').value = 'Price';
    worksheet.getCell('M2').value = 'Gentani';
    worksheet.getCell('N2').value = 'Total';

    // Style headers
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'L1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'I2', 'J2', 'K2', 'L2', 'M2', 'N2'].forEach(key => {
        const cell = worksheet.getCell(key);
        cell.font = { bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFa8d8f1'}
        };
        cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };
    });
    // Special colors
    ['O1', 'P1', 'Q1', 'R1'].forEach(key => {
        worksheet.getCell(key).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFbe5014'} };
        worksheet.getCell(key).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    });
    worksheet.getCell('S1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFbbfebb'} };
    ['I2', 'J2', 'K2', 'L2', 'M2', 'N2'].forEach(key => {
        worksheet.getCell(key).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFe3f6ff'} };
    });

    // Add data
    const tableData = data.slice(1); // Assuming data[0] is headers
    tableData.forEach((row, index) => {
        worksheet.addRow([
            index + 1,
            getCleanValue(row['EG Model']),
            getCleanValue(row['Category']),
            getCleanValue(row['Casting Part']),
            getCleanValue(row['CC']),
            getCleanValue(row['Material No']),
            getCleanValue(row['Material Name']),
            getCleanValue(row['Material Category']),
            parseValueForExcel(row["Oct'24-Mar'25"][0]),
            parseValueForExcel(row["Oct'24-Mar'25"][1]),
            parseValueForExcel(row["Oct'24-Mar'25"][2]),
            parseValueForExcel(row["Apr-Sep'25"][0]),
            parseValueForExcel(row["Apr-Sep'25"][1]),
            parseValueForExcel(row["Apr-Sep'25"][2]),
            parseValueForExcel(row['Diff Amount']),
            getCleanValue(row['Diff %']),
            getCleanValue(row['Material Price Impact']),
            getCleanValue(row['Gentani Impact']),
            getCleanValue(row['Remark']),
        ]);
    });

    // Set column widths
    worksheet.columns = [
        { key: 'no', width: 5 },
        { key: 'eg_model', width: 15 },
        { key: 'category', width: 15 },
        { key: 'casting_part', width: 20 },
        { key: 'cc', width: 10 },
        { key: 'material_no', width: 15 },
        { key: 'material_name', width: 30 },
        { key: 'material_category', width: 20 },
        { key: 'oct_price', width: 15 },
        { key: 'oct_gentani', width: 15 },
        { key: 'oct_total', width: 15 },
        { key: 'apr_price', width: 15 },
        { key: 'apr_gentani', width: 15 },
        { key: 'apr_total', width: 15 },
        { key: 'diff_amount', width: 15 },
        { key: 'diff_percent', width: 10 },
        { key: 'material_price_impact', width: 20 },
        { key: 'gentani_impact', width: 20 },
        { key: 'remark', width: 20 },
    ];

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casting-material.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

  const tableData = data.slice(1);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(tableData.length / recordsPerPage);

  const goToPage = (page) => {
    if (page > 0 && page <= nPages) {
      setCurrentPage(page);
    }
  };

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

      <CastingMaterialHeader onDownload={handleDownload} />

      <div style={{ marginTop: "16px" }}>
        {/* The "Submit" and "Download" buttons are now in the header */}
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
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
            {currentRecords.map((row, index) => {
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
                  <td className="td-default" style={{...cellStyle, backgroundColor: '#eaf5e9'}}>{getCleanValue(row['Casting Part'])}</td>
                  <td className="td-default" style={{...cellStyle, backgroundColor: '#eaf5e9'}}>{getCleanValue(row['CC'])}</td>
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
        totalRecords={tableData.length}
        startIndex={indexOfFirstRecord}
        endIndex={indexOfLastRecord}
      />
    </div>
  );
};

export default CastingMaterialPage;