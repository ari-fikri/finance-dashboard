import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PPRHeader } from "./components/PPRHeader";
import { PPRTable } from "./components/PPRTable";
import Pagination from "./components/Pagination";
import { calculateDiff } from "./utils/pprHelpers";
import {
  getCellStateKey,
  calculateCostValues,
  getDisplayValues
} from "./utils/pprHelpers";
import { COST_ITEMS } from "./utils/pprConstants";

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