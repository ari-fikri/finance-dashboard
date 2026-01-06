import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './components/Pagination';
import ExcelJS from 'exceljs';
import CastingMaterialHeader from './components/CastingMaterialHeader';
import FunnelIcon from './components/FunnelIcon';
import FilterDialog from './components/FilterDialog';

//const getCleanValue = (val) => (val && String(val).trim() !== '' ? String(val).trim() : '');

// This component displays the casting material data in a filterable and paginated table.
const CastingMaterialPage = () => {
  // State for storing the original data from the CSV file.
  const [data, setData] = useState([]);
  // State for storing the filtered data to be displayed in the table.
  const [filteredData, setFilteredData] = useState([]);
  // State for managing loading status.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [filterDialog, setFilterDialog] = useState({
    isOpen: false,
    column: null,
    values: [],
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [comparisonPeriod, setComparisonPeriod] = useState("Oct'24-Mar'25");
  const [selectedPeriod, setSelectedPeriod] = useState("Apr-Sep'25");

  const availablePeriods = useMemo(() => {
    if (data.length < 2) return [];
    const firstRow = data[1];
    return Object.keys(firstRow).filter(key => Array.isArray(firstRow[key]));
  }, [data]);

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

    const dataToDownload = data.slice(1).filter(row => {
      return Object.entries(activeFilters).every(([column, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) {
          return true;
        }
        const cellValue = getCleanValue(row[column]);
        return selectedValues.includes(cellValue);
      });
    });

    // Header Row 1
    worksheet.addRow([
      'No', 'EG Model', 'Category', 'Casting Part', 'CC', 'Material No', 'Material Name', 'Material Category',
      comparisonPeriod, null, null,
      selectedPeriod, null, null,
      'Diff Amount', 'Diff %'
    ]);

    // Header Row 2
    worksheet.addRow([
      null, null, null, null, null, null, null, null,
      'Price', 'Gentani', 'Total',
      'Price', 'Gentani', 'Total',
      null, null
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
    worksheet.mergeCells('I1:K1'); // comparisonPeriod
    worksheet.mergeCells('L1:N1'); // selectedPeriod
    worksheet.mergeCells('O1:O2');
    worksheet.mergeCells('P1:P2');

    // Sub-headers for periods
    worksheet.getCell('I2').value = 'Price';
    worksheet.getCell('J2').value = 'Gentani';
    worksheet.getCell('K2').value = 'Total';
    worksheet.getCell('L2').value = 'Price';
    worksheet.getCell('M2').value = 'Gentani';
    worksheet.getCell('N2').value = 'Total';

    // Style headers
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'L1', 'O1', 'P1', 'I2', 'J2', 'K2', 'L2', 'M2', 'N2'].forEach(key => {
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
    ['O1', 'P1'].forEach(key => {
        worksheet.getCell(key).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFbe5014'} };
        worksheet.getCell(key).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    });
    ['I2', 'J2', 'K2', 'L2', 'M2', 'N2'].forEach(key => {
        worksheet.getCell(key).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'FFe3f6ff'} };
    });

    // Add data
    dataToDownload.forEach((row, index) => {
        worksheet.addRow([
            index + 1,
            getCleanValue(row['EG Model']),
            getCleanValue(row['Category']),
            getCleanValue(row['Casting Part']),
            getCleanValue(row['CC']),
            getCleanValue(row['Material No']),
            getCleanValue(row['Material Name']),
            getCleanValue(row['Material Category']),
            parseValueForExcel(row[comparisonPeriod]?.[0]),
            parseValueForExcel(row[comparisonPeriod]?.[1]),
            parseValueForExcel(row[comparisonPeriod]?.[2]),
            parseValueForExcel(row[selectedPeriod]?.[0]),
            parseValueForExcel(row[selectedPeriod]?.[1]),
            parseValueForExcel(row[selectedPeriod]?.[2]),
            parseValueForExcel(row['Diff Amount']),
            getCleanValue(row['Diff %']),
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
    const castingMaterialUrl = `${import.meta.env.BASE_URL}Casting Material.json`;
    fetch(castingMaterialUrl)
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

  const getUniqueValues = (key) => {
    if (data.length < 2) return [];

    const otherFilters = { ...activeFilters };
    delete otherFilters[key];

    const dataRows = data.slice(1);
    const filteredForDialog = dataRows.filter(row => {
      return Object.entries(otherFilters).every(([filterKey, values]) => {
        if (values.length === 0) return true;
        const cellValue = getCleanValue(row[filterKey]);
        const filterValues = values.map(v => v === '(blank)' ? '' : v);
        return filterValues.includes(cellValue);
      });
    });

    const uniqueValues = [...new Set(filteredForDialog.map(item => getCleanValue(item[key])))];
    
    return uniqueValues.map(value => value === '' ? '(blank)' : value);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openFilterDialog = (column) => {
    setFilterDialog({
      isOpen: true,
      column,
      values: getUniqueValues(column),
    });
  };

  const closeFilterDialog = () => {
    setFilterDialog({ isOpen: false, column: null, values: [] });
  };

  // Applies the selected filters to the data by updating the activeFilters state.
  const handleApplyFilter = (column, selectedValues) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      [column]: selectedValues
    }));
    closeFilterDialog();
  };

  // This effect hook handles the filtering logic. It runs whenever the
  // active filters or the main data set changes.
  useEffect(() => {
    if (data.length < 2) {
      setFilteredData(data);
      return;
    }

    const dataRows = data.slice(1);
    const filteredRows = dataRows.filter(row => {
      // A row is kept if it satisfies ALL active column filters.
      return Object.entries(activeFilters).every(([key, values]) => {
        // If a filter for a column has no selected values, it's ignored.
        if (values.length === 0) {
          return true;
        }

        const cellValue = getCleanValue(row[key]);

        // Check if the cell value matches any of the selected filter values.
        // This includes a special check for '(blank)'.
        const matchesBlank = values.includes('(blank)') && cellValue === '';
        const matchesValue = values.includes(cellValue);

        return matchesBlank || matchesValue;
      });
    });

    // Update the state with the filtered rows, keeping the header.
    setFilteredData([data[0], ...filteredRows]);
  }, [activeFilters, data]);

  // Cleans up a value by trimming it and handling null/undefined/0 cases.
  const getCleanValue = (value) => {
    if (value === null || value === undefined || value === 0) {
      return '';
    }
    return String(value).trim();
  };

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

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading data: {error.message}</div>;
  }

  if (data.length === 0) {
    return <div className="p-4">No data available.</div>;
  }

  const tableData = filteredData.slice(1);

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
    <div style={{ background: "#fff", padding: "16px", position: "relative", display: 'flex', flexDirection: 'column', height: 'calc(100vh - 32px)' }}>
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

      <CastingMaterialHeader
        onDownload={handleDownload}
        selectedPeriod={selectedPeriod}
        comparisonPeriod={comparisonPeriod}
        availablePeriods={availablePeriods}
        onPeriodChange={setSelectedPeriod}
        onComparisonPeriodChange={setComparisonPeriod}
      />

      <div style={{ marginTop: "16px" }}>
        {/* The "Submit" and "Download" buttons are now in the header */}
      </div>

      <div style={{ overflow: "auto", flex: '1 1 auto' }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th rowSpan="2" className="tbl-header">No</th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('EG Model')}>
                  EG Model <FunnelIcon filled={activeFilters['EG Model']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'EG Model' && (
                  <FilterDialog
                    title="EG Model"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['EG Model'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('EG Model', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('Category')}>
                  Category <FunnelIcon filled={activeFilters['Category']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'Category' && (
                  <FilterDialog
                    title="Category"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['Category'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('Category', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('Casting Part')}>
                  Casting Part <FunnelIcon filled={activeFilters['Casting Part']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'Casting Part' && (
                  <FilterDialog
                    title="Casting Part"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['Casting Part'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('Casting Part', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('CC')}>
                  CC <FunnelIcon filled={activeFilters['CC']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'CC' && (
                  <FilterDialog
                    title="CC"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['CC'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('CC', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('Material No')}>
                  Material No <FunnelIcon filled={activeFilters['Material No']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'Material No' && (
                  <FilterDialog
                    title="Material No"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['Material No'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('Material No', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('Material Name')}>
                  Material Name <FunnelIcon filled={activeFilters['Material Name']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'Material Name' && (
                  <FilterDialog
                    title="Material Name"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['Material Name'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('Material Name', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th rowSpan="2" className="tbl-header" style={{ background: '#a8d8f1', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => openFilterDialog('Material Category')}>
                  Material Category <FunnelIcon filled={activeFilters['Material Category']?.length > 0} />
                </div>
                {filterDialog.isOpen && filterDialog.column === 'Material Category' && (
                  <FilterDialog
                    title="Material Category"
                    values={filterDialog.values}
                    initialCheckedValues={activeFilters['Material Category'] || filterDialog.values}
                    onApply={(selected) => handleApplyFilter('Material Category', selected)}
                    onClose={() => setFilterDialog({ isOpen: false, column: null, values: [] })}
                  />
                )}
              </th>
              <th colSpan="3" className="tbl-header" style={{ background: '#a8d8f1' }}>{comparisonPeriod}</th>
              <th colSpan="3" className="tbl-header" style={{ background: '#a8d8f1' }}>{selectedPeriod}</th>
              <th colSpan="2" className="tbl-header" style={{ background: '#be5014', color: 'white' }}>Total</th>
            </tr>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Price</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Gentani</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Total</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Price</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Gentani</th>
              <th className="tbl-header" style={{ background: '#e3f6ff' }}>Total</th>
              <th className="tbl-header" style={{ background: '#fbd9ca' }}>Diff Amount</th>
              <th className="tbl-header" style={{ background: '#fbd9ca' }}>Diff %</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((row, index) => {
              const remark = getCleanValue(row['Remark']);
              const rowStyle = remark === 'New Material' ? { backgroundColor: '#eaf5e9' } : {};
              const diffAmountStyle = remark === 'delete material' ? { backgroundColor: '#eaf5e9' } : {};
              const gentaniImpactStyle = remark === 'Increasing gentani' ? { backgroundColor: '#eaf5e9' } : {};

              const cellStyle = { border: '1px solid #e5e7eb', textAlign: 'left' };
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
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[comparisonPeriod]?.[0])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[comparisonPeriod]?.[1])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[comparisonPeriod]?.[2])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[selectedPeriod]?.[0])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[selectedPeriod]?.[1])}</td>
                  <td className="td-default" style={rightCellStyle}>{formatValue(row[selectedPeriod]?.[2])}</td>
                  <td className="td-default" style={{...rightCellStyle, ...diffAmountStyle}}>{formatValue(row['Diff Amount'])}</td>
                  <td className="td-default" style={rightCellStyle}>{getCleanValue(row['Diff %'])}</td>
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
        recordsPerPage={recordsPerPage}
        onRecordsPerPageChange={handleRecordsPerPageChange}
      />
    </div>
  );
};

export default CastingMaterialPage;

const applyFilters = (column, selectedValues) => {
  const newFilters = { ...activeFilters, [column]: selectedValues };
  setActiveFilters(newFilters);

  const dataRows = data.slice(1);

  const filtered = dataRows.filter(row => {
    return Object.entries(newFilters).every(([key, values]) => {
      if (values.length === 0) return true;

      const cellValue = getCleanValue(row[key]);
      debugger;
      // If '(blank)' is selected and the cell is blank, it's a match.
      if (values.includes('(blank)') && cellValue === '') {
        return true;
      }

      // If the cell value is in the list of selected values, it's a match.
      if (values.includes(cellValue)) {
        return true;
      }

      // If none of the above, it's not a match.
      return false;
    });
  });

  setFilteredData([data[0], ...filtered]);
  closeFilterDialog();
};

const getColumnChar = (index) => {
  let temp, letter = '';
  return temp[index];
};