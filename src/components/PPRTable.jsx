import React from "react";
import FilterDialog from "./FilterDialog";
import { CostItemRow } from "./CostItemRow";
import FunnelIcon from "./FunnelIcon";
import { ANALYSIS_COLUMNS, COST_ITEMS } from "../utils/pprConstants";
import { getAnalysisValue, getRemarkValue } from "../utils/pprHelpers";

export function PPRTable(props) {
  const {
    filteredMspData,
    filterStates,
    toggleFilter,
    uniquePartNos,
    uniqueImporters,
    uniqueCategories,
    filteredPartNos,
    filteredImporters,
    filteredCategories,
    onApplyFilter,
    onApplyImporterFilter,
    onApplyCategoryFilter,
    selectedPeriod,
    comparisonPeriod,
    calculateCostValues,
    calculateDiff,
    getDisplayValues,
    handleCellChange,
    analysisData,
    toggleThresholdFilter,
    thresholdActive
  } = props;

  return (
    <div style={{ overflowX: "auto", background: "#fff" }}>
      <div style={{ padding: '8px 0px', background: '#fff', borderBottom: '1px solid #d1d5db', display: 'flex', gap: '8px' }}>
        <button
          onClick={toggleThresholdFilter}
          style={{
            padding: '6px 12px',
            fontSize: 12,
            background: thresholdActive ? '#2563eb' : '#e5e7eb',
            color: thresholdActive ? '#fff' : '#1f2937',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Threshold
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <tr style={{ borderBottom: "1px solid #d1d5db" }}>
            <th rowSpan={2} className="tbl-header" style={{ minWidth: 120, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Part No</span>
                <span style={{ cursor: 'pointer' }} onClick={() => toggleFilter('partNo')}><FunnelIcon /></span>
              </div>
              {filterStates.partNo && (
                <FilterDialog
                  title="Part No"
                  values={uniquePartNos}
                  initialCheckedValues={filteredPartNos}
                  onApply={onApplyFilter}
                  onClose={() => toggleFilter('partNo')}
                />
              )}
            </th>
            <th rowSpan={2} className="tbl-header" style={{position: 'relative'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>importer</span>
                <span style={{ cursor: 'pointer' }} onClick={() => toggleFilter('importer')}><FunnelIcon /></span>
              </div>
              {filterStates.importer && (
                <FilterDialog
                  title="Importer"
                  values={uniqueImporters}
                  initialCheckedValues={filteredImporters}
                  onApply={onApplyImporterFilter}
                  onClose={() => toggleFilter('importer')}
                />
              )}
            </th>
            <th rowSpan={2} className="tbl-header" style={{position: 'relative'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>category</span>
                <span style={{ cursor: 'pointer' }} onClick={() => toggleFilter('category')}><FunnelIcon /></span>
              </div>
              {filterStates.category && (
                <FilterDialog
                  title="Category"
                  values={uniqueCategories}
                  initialCheckedValues={filteredCategories}
                  onApply={onApplyCategoryFilter}
                  onClose={() => toggleFilter('category')}
                />
              )}
            </th>
            <th rowSpan={2} className="tbl-header">Cost Item</th>
            
            {/* Calculation section */}
            <th colSpan={6} style={{ textAlign: "center", padding: "8px", background: "#a8d8f0", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
              Calculation
            </th>
            
            {/* Analysis section */}
            <th colSpan={ANALYSIS_COLUMNS.length} style={{ textAlign: "center", padding: "8px", background: "#f5d5a8", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
              Analysis
            </th>
            <th rowSpan={2} className="tbl-header" style={{minWidth: 150, background: "#bbfebb" }}>Remark</th>
          </tr>
          <tr style={{ borderBottom: "1px solid #d1d5db" }}>
            <th className="tbl-header" style={{ minWidth: 70, background: '#e3f6ff' }}>{comparisonPeriod}</th>
            <th className="tbl-header" style={{minWidth: 70, background: '#e3f6ff' }}>{selectedPeriod}</th>
            <th className="tbl-header" style={{minWidth: 60, background: '#e3f6ff' }}>diff Amt</th>
            <th className="tbl-header" style={{minWidth: 50, background: '#e3f6ff' }}>diff %</th>
            <th className="tbl-header" style={{minWidth: 60, background: '#e3f6ff' }}>PBMD</th>
            <th className="tbl-header" style={{minWidth: 60, background: '#e3f6ff' }}>Adj Value</th>
            {ANALYSIS_COLUMNS.map(col => (
              <th key={col} className="tbl-header"  style={{minWidth: 70, background: '#faebd7' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredMspData.map((part) => (
            COST_ITEMS.map((costItem, idx) => (
                <CostItemRow
                  key={`${part.part_no}-${costItem}`}
                  part={part}
                  costItem={costItem}
                  idx={idx}
                  selectedPeriod={selectedPeriod}
                  comparisonPeriod={comparisonPeriod}
                  calculateCostValues={calculateCostValues}
                  calculateDiff={calculateDiff}
                  getDisplayValues={getDisplayValues}
                  handleCellChange={handleCellChange}
                  analysisData={analysisData}
                />
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
}