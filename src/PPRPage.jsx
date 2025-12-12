import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PPRHeader } from "./components/PPRHeader";
import { PPRTable } from "./components/PPRTable";
import Pagination from "./components/Pagination";
import { calculateDiff } from "./utils/pprHelpers";
import {
  getCellStateKey,
  calculateCostValues,
  getDisplayValues,
  getAnalysisValue,
  getRemarkValue,
} from "./utils/pprHelpers";
import { COST_ITEMS, ANALYSIS_COLUMNS } from "./utils/pprConstants";
import ExcelJS from "exceljs";

export default function PPRPage() {
  const [mspData, setMspData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-02");
  const [comparisonPeriod, setComparisonPeriod] = useState("2024-08");
  const [analysisData, setAnalysisData] = useState({});
  const [filterStates, setFilterStates] = useState({
    partNo: false,
    importer: false,
    category: false
  });
  const [filteredPartNos, setFilteredPartNos] = useState([]);
  const [filteredImporters, setFilteredImporters] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [thresholdActive, setThresholdActive] = useState(false);
  const itemsPerPage = 5;

  async function handleDownload() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PPR Table");

    // First header row
    worksheet.addRow([
        "Part No",
        "Importer",
        "Category",
        "Cost Item",
        "Calculation", "", "", "", "", "", // 6 columns for Calculation
        "Analysis", ...Array(ANALYSIS_COLUMNS.length - 1).fill(""), // N columns for Analysis
        "Remark"
    ]);

    // Second header row
    worksheet.addRow([
        "", "", "", "",
        comparisonPeriod,
        `PBMD ${comparisonPeriod}`,
        selectedPeriod,
        "Diff Amt",
        "Diff %",
        "Adj Value",
        ...ANALYSIS_COLUMNS,
        ""
    ]);

    // Merge cells for "Calculation" and "Analysis" in the first header row
    worksheet.mergeCells("E1:J1"); // Calculation spans columns E to J
    worksheet.mergeCells(`K1:${String.fromCharCode(75 + ANALYSIS_COLUMNS.length - 1)}1`); // Analysis spans columns K onward
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B1:B2");
    worksheet.mergeCells("C1:C2");
    worksheet.mergeCells("D1:D2");
    worksheet.mergeCells(`${String.fromCharCode(75 + ANALYSIS_COLUMNS.length)}1:${String.fromCharCode(75 + ANALYSIS_COLUMNS.length)}2`); // Remark column

    // Apply styles (example for header)
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
  
    // Define columns
    worksheet.columns = [
      { header: "Part No", key: "part_no", width: 15 },
      { header: "Importer", key: "importer", width: 15 },
      { header: "Category", key: "category", width: 15 },
      { header: "Cost Item", key: "cost_item", width: 20 },
      { header: comparisonPeriod, key: "prev", width: 15 },
      { header: `PBMD ${comparisonPeriod}`, key: "pbmd", width: 18 },
      { header: selectedPeriod, key: "curr", width: 15 },
      { header: "Diff Amt", key: "diff_amt", width: 15 },
      { header: "Diff %", key: "diff_pct", width: 10 },
      { header: "Adj Value", key: "adj", width: 15 },
      ...ANALYSIS_COLUMNS.map(col => ({ header: col, key: col, width: 15 })),
      { header: "Remark", key: "remark", width: 20 }
    ];
  
    // Add header styling
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      // Section coloring
      if (colNumber >= 5 && colNumber <= 10) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFA8D8F0" } }; // Calculation
      if (colNumber >= 11 && colNumber < 11 + ANALYSIS_COLUMNS.length) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5D5A8" } }; // Analysis
      if (colNumber === worksheet.columns.length) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBBFEBB" } }; // Remark
    });
  
    // Add data rows
    finalFilteredData.forEach(part => {
      COST_ITEMS.forEach((costItem, idx) => {
        const { currentValue, previousValue } = calculateCostValues(part, costItem, selectedPeriod, comparisonPeriod);
        const diffAmt = currentValue - previousValue;
        const diffPercent = calculateDiff(currentValue, previousValue);
        const { pbmdDisplayValue, adjDisplayValue } = getDisplayValues(part, costItem, analysisData);
  
        const rowObj = {
          part_no: idx === 0 ? part.part_no : "",
          importer: idx === 0 ? part.importer : "",
          category: idx === 0 ? part.category : "",
          cost_item: costItem,
          prev: previousValue,
          pbmd: pbmdDisplayValue,
          curr: currentValue,
          diff_amt: diffAmt,
          diff_pct: diffPercent ? `${diffPercent.toFixed(2)}%` : "-",
          adj: adjDisplayValue,
          remark: getRemarkValue(part, costItem, analysisData)
        };
  
        ANALYSIS_COLUMNS.forEach(col => {
          rowObj[col] = getAnalysisValue(part, costItem, col, analysisData);
        });
  
        const row = worksheet.addRow(rowObj);
  
        // Row coloring
        const isSummaryRow = ["Total Purchase Cost", "Total Process Cost", "Total Cost"].includes(costItem);
        const bgColor = isSummaryRow ? "FFF9FACD" : (idx % 2 === 0 ? "FFFAFAFA" : "FFFFFFFF");
        row.eachCell((cell, colNumber) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } }
          };
          if (isSummaryRow) cell.font = { bold: true };
          // Part/Importer/Category column coloring
          if (colNumber >= 1 && colNumber <= 3) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F1F7" } };
          // Diff % coloring
          if (colNumber === 9 && diffPercent && Math.abs(diffPercent) > 15) cell.font = { color: { argb: "FFDC2626" }, bold: true };
        });
      });
    });
  
    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ppr_table.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchData = async () => {      
      const fileUrl = `${import.meta.env.BASE_URL}msp.json`;
      try {
        const res = await fetch(fileUrl);
        const data = await res.json();
        setMspData(data.items || []);
        const allPartNos = Array.from(new Set(data.items.map(item => item.part_no)));
        setFilteredPartNos(allPartNos);
        setFilteredImporters(Array.from(new Set(data.items.map(item => item.importer))));
        setFilteredCategories(Array.from(new Set(data.items.map(item => item.category))));
      } catch (err) {
        console.error("Failed to load msp.json:", err);
      }
    }
    fetchData();
  }, []);

  const toggleThresholdFilter = useCallback(() => {
    setThresholdActive(prev => !prev);
    setCurrentPage(1);
  }, []);

  const handleCellChange = useCallback((partNo, costItem, column, value) => {
    const key = getCellStateKey(partNo, costItem, column);
    setAnalysisData(prev => ({ ...prev, [key]: value }));
  }, []);

  const wrappedGetDisplayValues = useCallback((part, costItem) =>
    getDisplayValues(part, costItem, analysisData), [analysisData]
  );

  const availablePeriods = useMemo(() => {
    const periods = new Set();
    mspData.forEach(item => {
      if (item.months) {
        Object.keys(item.months).forEach(month => periods.add(month));
      }
    });
    return Array.from(periods).sort().reverse();
  }, [mspData]);

  const availableImporters = useMemo(() => {
    const importers = new Set();
    mspData.forEach(item => {
      if (filteredPartNos.includes(item.part_no) && filteredCategories.includes(item.category)) {
        importers.add(item.importer);
      }
    });
    return Array.from(importers);
  }, [mspData, filteredPartNos, filteredCategories]);

  const availableCategories = useMemo(() => {
    const categories = new Set();
    mspData.forEach(item => {
      if (filteredPartNos.includes(item.part_no) && filteredImporters.includes(item.importer)) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }, [mspData, filteredPartNos, filteredImporters]);

  const availablePartNos = useMemo(() => {
    const partNos = new Set();
    mspData.forEach(item => {
      if (filteredImporters.includes(item.importer) && filteredCategories.includes(item.category)) {
        partNos.add(item.part_no);
      }
    });
    return Array.from(partNos);
  }, [mspData, filteredImporters, filteredCategories]);

  const filteredMspData = useMemo(() => 
    mspData.filter(item => 
      filteredPartNos.includes(item.part_no) &&
      filteredImporters.includes(item.importer) &&
      filteredCategories.includes(item.category)
    ), [mspData, filteredPartNos, filteredImporters, filteredCategories]
  );

  const partNosWithThresholdIssues = useMemo(() => {
    const partNos = new Set();
    const uniqueParts = [];
    const seenPartNos = new Set();

    for (const item of filteredMspData) {
      if (!seenPartNos.has(item.part_no)) {
        uniqueParts.push(item);
        seenPartNos.add(item.part_no);
      }
    }

    uniqueParts.forEach(part => {
      COST_ITEMS.forEach(costItem => {
        const { currentValue, previousValue } = calculateCostValues(part, costItem, selectedPeriod, comparisonPeriod);
        const diffPercent = calculateDiff(currentValue, previousValue);
        if (diffPercent && Math.abs(diffPercent) > 15) {
          partNos.add(part.part_no);
        }
      });
    });
    return Array.from(partNos);
  }, [filteredMspData, selectedPeriod, comparisonPeriod]);

  const finalFilteredData = useMemo(() => {
    if (thresholdActive) {
      return filteredMspData.filter(item => partNosWithThresholdIssues.includes(item.part_no));
    }
    return filteredMspData;
  }, [filteredMspData, thresholdActive, partNosWithThresholdIssues]);

  const uniqueFilteredPartNos = useMemo(() => 
    Array.from(new Set(finalFilteredData.map(item => item.part_no))), 
    [finalFilteredData]
  );

  const totalPages = Math.ceil(uniqueFilteredPartNos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPartNos = uniqueFilteredPartNos.slice(startIndex, startIndex + itemsPerPage);

  const paginatedMspData = useMemo(() => 
    finalFilteredData.filter(item => currentPartNos.includes(item.part_no)),
    [finalFilteredData, currentPartNos]
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleApplyFilter = useCallback((selectedPartNos) => {
    setFilteredPartNos(selectedPartNos);
    setFilterStates(prev => ({ ...prev, partNo: false }));
    setCurrentPage(1);
  }, []);

  const handleApplyImporterFilter = useCallback((selectedImporters) => {
    setFilteredImporters(selectedImporters);
    setFilterStates(prev => ({ ...prev, importer: false }));
    setCurrentPage(1);
  }, []);

  const handleApplyCategoryFilter = useCallback((selectedCategories) => {
    setFilteredCategories(selectedCategories);
    setFilterStates(prev => ({ ...prev, category: false }));
    setCurrentPage(1);
  }, []);

  const toggleFilter = useCallback((filterType) => {
    setFilterStates(prev => ({ ...prev, [filterType]: !prev[filterType] }));
  }, []);

  return (
    <div style={{ background: "#fff", padding: "16px" }}>
      <PPRHeader 
        selectedPeriod={selectedPeriod}
        comparisonPeriod={comparisonPeriod}
        availablePeriods={availablePeriods}
        onPeriodChange={setSelectedPeriod}
        onComparisonPeriodChange={setComparisonPeriod}
        onDownload={handleDownload}
      />

      <PPRTable
        filteredMspData={paginatedMspData}
        filterStates={filterStates}
        toggleFilter={toggleFilter}
        uniquePartNos={availablePartNos}
        uniqueImporters={availableImporters}
        uniqueCategories={availableCategories}
        filteredPartNos={filteredPartNos}
        filteredImporters={filteredImporters}
        filteredCategories={filteredCategories}
        onApplyFilter={handleApplyFilter}
        onApplyImporterFilter={handleApplyImporterFilter}
        onApplyCategoryFilter={handleApplyCategoryFilter}
        selectedPeriod={selectedPeriod}
        comparisonPeriod={comparisonPeriod}
        calculateCostValues={calculateCostValues}
        calculateDiff={calculateDiff}
        getDisplayValues={wrappedGetDisplayValues}
        handleCellChange={handleCellChange}
        analysisData={analysisData}
        toggleThresholdFilter={toggleThresholdFilter}
        thresholdActive={thresholdActive}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        totalRecords={uniqueFilteredPartNos.length}
        startIndex={startIndex}
        endIndex={startIndex + itemsPerPage}
      />
    </div>
  );
}