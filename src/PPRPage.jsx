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

  const uniquePartNos = useMemo(() => 
    Array.from(new Set(mspData.map(item => item.part_no))), [mspData]
  );

  const uniqueImporters = useMemo(() => 
    Array.from(new Set(mspData.map(item => item.importer))), [mspData]
  );

  const uniqueCategories = useMemo(() => 
    Array.from(new Set(mspData.map(item => item.category))), [mspData]
  );

  const filteredMspData = useMemo(() => 
    mspData.filter(item => 
      filteredPartNos.includes(item.part_no) &&
      filteredImporters.includes(item.importer) &&
      filteredCategories.includes(item.category)
    ), [mspData, filteredPartNos, filteredImporters, filteredCategories]
  );

  const uniqueFilteredPartNos = useMemo(() => 
    Array.from(new Set(filteredMspData.map(item => item.part_no))), 
    [filteredMspData]
  );

  const totalPages = Math.ceil(uniqueFilteredPartNos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPartNos = uniqueFilteredPartNos.slice(startIndex, startIndex + itemsPerPage);

  const paginatedMspData = useMemo(() => 
    filteredMspData.filter(item => currentPartNos.includes(item.part_no)),
    [filteredMspData, currentPartNos]
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
        uniquePartNos={uniquePartNos}
        uniqueImporters={uniqueImporters}
        uniqueCategories={uniqueCategories}
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