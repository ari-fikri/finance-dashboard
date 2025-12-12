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
import * as XLSX from "xlsx";

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

  const handleDownload = () => {
    const headerStyle = (bgColor) => ({
      fill: { patternType: "solid", fgColor: { rgb: bgColor } },
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "d1d5db" } },
        bottom: { style: "thin", color: { rgb: "d1d5db" } },
        left: { style: "thin", color: { rgb: "d1d5db" } },
        right: { style: "thin", color: { rgb: "d1d5db" } },
      },
    });

    const cellStyle = (bgColor, isBold = false, isRed = false) => ({
      fill: { patternType: "solid", fgColor: { rgb: bgColor } },
      font: { bold: isBold, color: { rgb: isRed ? "dc2626" : "000000" } },
      border: {
        top: { style: "thin", color: { rgb: "e5e7eb" } },
        bottom: { style: "thin", color: { rgb: "e5e7eb" } },
        left: { style: "thin", color: { rgb: "e5e7eb" } },
        right: { style: "thin", color: { rgb: "e5e7eb" } },
      },
      alignment: {
        vertical: "middle",
      },
    });

    const header1 = [
      "Part No",
      "Importer",
      "Category",
      "Cost Item",
      "Calculation",
      ...Array(5).fill(null), // for calculation colspan
      "Analysis",
      ...Array(ANALYSIS_COLUMNS.length - 1).fill(null), // for analysis colspan
      "Remark",
    ];

    const header2 = [
      null,
      null,
      null,
      null, // for part, importer, category, cost item rowspan
      comparisonPeriod,
      `PBMD ${comparisonPeriod}`,
      selectedPeriod,
      "Diff Amt",
      "Diff %",
      "Adj Value",
      ...ANALYSIS_COLUMNS,
      null, // for remark rowspan
    ];

    const dataForSheet = [header1, header2];

    finalFilteredData.forEach((part) => {
      COST_ITEMS.forEach((costItem, costItemIndex) => {
        const { currentValue, previousValue } = calculateCostValues(
          part,
          costItem,
          selectedPeriod,
          comparisonPeriod
        );
        const diffAmt = currentValue - previousValue;
        const diffPercent = calculateDiff(currentValue, previousValue);
        const { pbmdDisplayValue, adjDisplayValue } = getDisplayValues(
          part,
          costItem,
          analysisData
        );

        const row = [];
        if (costItemIndex === 0) {
          row.push(part.part_no, part.importer, part.category);
        } else {
          row.push(null, null, null);
        }

        row.push(
          costItem,
          previousValue,
          pbmdDisplayValue,
          currentValue,
          diffAmt,
          diffPercent ? `${diffPercent.toFixed(2)}%` : "-",
          adjDisplayValue
        );

        ANALYSIS_COLUMNS.forEach((col) => {
          const val = getAnalysisValue(part, costItem, col, analysisData);
          row.push(val !== null && val !== undefined ? val : "-");
        });

        row.push(getRemarkValue(part, costItem, analysisData) || "-");
        dataForSheet.push(row);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);

    // Merges
    const merges = [
      // Header merges
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Part No
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Importer
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Category
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Cost Item
      { s: { r: 0, c: 4 }, e: { r: 0, c: 9 } }, // Calculation
      {
        s: { r: 0, c: 10 },
        e: { r: 0, c: 10 + ANALYSIS_COLUMNS.length - 1 },
      }, // Analysis
      {
        s: { r: 0, c: 10 + ANALYSIS_COLUMNS.length },
        e: { r: 1, c: 10 + ANALYSIS_COLUMNS.length },
      }, // Remark
    ];

    let currentRow = 2;
    finalFilteredData.forEach(() => {
      merges.push({
        s: { r: currentRow, c: 0 },
        e: { r: currentRow + COST_ITEMS.length - 1, c: 0 },
      });
      merges.push({
        s: { r: currentRow, c: 1 },
        e: { r: currentRow + COST_ITEMS.length - 1, c: 1 },
      });
      merges.push({
        s: { r: currentRow, c: 2 },
        e: { r: currentRow + COST_ITEMS.length - 1, c: 2 },
      });
      currentRow += COST_ITEMS.length;
    });
    worksheet["!merges"] = merges;

    // Header styles
    const header1_colors = [
      "ffffff",
      "ffffff",
      "ffffff",
      "ffffff",
      "a8d8f0",
      null,
      null,
      null,
      null,
      null,
      "f5d5a8",
      ...Array(ANALYSIS_COLUMNS.length - 1).fill(null),
      "bbfebb",
    ];
    header1.forEach((_, c) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c });
      if (worksheet[cellRef] && header1_colors[c]) {
        worksheet[cellRef].s = headerStyle(header1_colors[c]);
      }
    });

    const header2_colors = [
      null,
      null,
      null,
      null,
      ...Array(6).fill("e3f6ff"),
      ...Array(ANALYSIS_COLUMNS.length).fill("faebd7"),
      null,
    ];
    header2.forEach((_, c) => {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c });
      if (worksheet[cellRef] && header2_colors[c]) {
        worksheet[cellRef].s = headerStyle(header2_colors[c]);
      }
    });

    // Data row styles
    currentRow = 2;
    finalFilteredData.forEach((part) => {
      COST_ITEMS.forEach((costItem, costItemIndex) => {
        const rowIndex = currentRow + costItemIndex;
        const isSummaryRow = [
          "Total Purchase Cost",
          "Total Process Cost",
          "Total Cost",
        ].includes(costItem);
        const rowBgColor = isSummaryRow
          ? "f9facd"
          : costItemIndex % 2 === 0
          ? "fafafa"
          : "ffffff";

        for (let colIndex = 0; colIndex < header1.length; colIndex++) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
          if (!worksheet[cellRef]) continue;

          const isBold = isSummaryRow;
          let isRed = false;
          if (colIndex === 8) {
            // Diff %
            const { currentValue, previousValue } = calculateCostValues(
              part,
              costItem,
              selectedPeriod,
              comparisonPeriod
            );
            const diffPercent = calculateDiff(currentValue, previousValue);
            if (diffPercent && Math.abs(diffPercent) > 15) {
              isRed = true;
            }
          }

          let currentBgColor = rowBgColor;
          if (colIndex >= 0 && colIndex < 3) {
            currentBgColor = "e8f1f7";
          }

          worksheet[cellRef].s = cellStyle(currentBgColor, isBold, isRed);
          if (colIndex > 2) {
            worksheet[cellRef].t = "n";
            if (colIndex === 8) worksheet[cellRef].t = "s";
            if (colIndex === 3) worksheet[cellRef].t = "s";
            if (colIndex > 9) worksheet[cellRef].t = "s";
          }
        }
      });
      currentRow += COST_ITEMS.length;
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PPR Data");
    XLSX.writeFile(workbook, "ppr_data_styled.xlsx");
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