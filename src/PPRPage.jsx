import React, { useMemo, useState, useEffect } from "react";
import FilterDialog from "./components/FilterDialog";

const costItems = [
  "Tooling OH",
  "Raw Material",
  "Total Purchase Cost",
  "Labor",
  "FOH Fix",
  "FOH Var",
  "Depre Common",
  "Depre Exclusive",
  "Total Process Cost",
  "Total Cost",
  "MH Cost",
  "Sales Volume",
  "Prod Volume"
];

const analysisColumns = [
  "Volume",
  "Inflation",
  "CR",
  "Material Price Impact",
  "Gentan-I Impact",
  "Material Change"
];

export default function PPRPage() {
  const [mspData, setMspData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-02");
  const [comparisonPeriod, setComparisonPeriod] = useState("2024-08");
  const [analysisData, setAnalysisData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filteredPartNos, setFilteredPartNos] = useState([]);

  useEffect(() => {
    fetch("/msp.json")
      .then((res) => res.json())
      .then((data) => {
        setMspData(data.items || []);
        setFilteredPartNos(Array.from(new Set(data.items.map(item => item.part_no))));
      })
      .catch((err) => console.error("Failed to load msp.json:", err));
  }, []);

  const costItemKeys = {
    "Tooling OH": "tooling_oh",
    "Raw Material": "raw_material",
    "Labor": "labor",
    "FOH Fix": "foh_fixed",
    "FOH Var": "foh_var",
    "Depre Common": "depre_common",
    "Depre Exclusive": "depre_exclusive",
    "Total Cost": "total_cost",
    "MH Cost": "mh_cost",
    "Sales Volume": "sales_volume",
    "Prod Volume": "prod_volume"
  };

  const getCostValue = (part, period, costItem) => {
    if (!part.months || !part.months[period]) return null;
    const key = costItemKeys[costItem];
    return part.months[period][key];
  };

  const calculateDiff = (current, previous) => {
    if (!current || !previous) return null;
    return ((current - previous) / previous) * 100;
  };

  const getCellStateKey = (partNo, costItem, column) => `${partNo}:::${costItem}:::${column}`;

  const handleCellChange = (partNo, costItem, column, value) => {
    const key = getCellStateKey(partNo, costItem, column);
    setAnalysisData(prev => ({ ...prev, [key]: value }));
  };

  const getCellValueFromState = (partNo, costItem, column) => {
    const key = getCellStateKey(partNo, costItem, column);
    return analysisData.hasOwnProperty(key) ? analysisData[key] : undefined;
  };

  const getPBMDValue = (part, costItem) => {
    const key = costItemKeys[costItem];
    const stateVal = getCellValueFromState(part.part_no, costItem, "PBMD");
    if (stateVal !== undefined) return stateVal;
    return part.months && part.months.pbmd_values ? part.months.pbmd_values[key] : "";
  };

  const getAdjValue = (part, costItem) => {
    const key = costItemKeys[costItem];
    const stateVal = getCellValueFromState(part.part_no, costItem, "Adj");
    if (stateVal !== undefined) return stateVal;
    return part.months && part.months.adj_values ? part.months.adj_values[key] : "";
  };

  const getRemarkValue = (part) => {
    const stateVal = getCellValueFromState(part.part_no, "__remark__", "Remark");
    if (stateVal !== undefined) return stateVal;
    if (part.months && part.months.adj_values && part.months.adj_values.remark) return part.months.adj_values.remark;
    if (part.months && part.months.pbmd_values && part.months.pbmd_values.remark) return part.months.pbmd_values.remark;
    return "";
  };

  const getAnalysisDefault = (part, costItem, column) => {
    // map display column labels to the exact month keys stored in msp.json
    const columnToMonthKey = {
      'Volume': 'volume',
      'Inflation': 'inflation',
      'CR': 'CR',
      'Material Price Impact': 'material_price_impact',
      'Gentan-I Impact': 'gentan_i_impact',
      'Material Change': 'material_change'
    };

    const blockKey = columnToMonthKey[column] || column.toLowerCase().replace(/ /g, "_");
    const costKey = costItemKeys[costItem];
    if (part.months && part.months[blockKey]) return part.months[blockKey][costKey];
    return "";
  };

  const getAnalysisValue = (part, costItem, column) => {
    const stateVal = getCellValueFromState(part.part_no, costItem, column);
    if (stateVal !== undefined) return stateVal;
    const def = getAnalysisDefault(part, costItem, column);
    return def !== undefined && def !== null ? def : "";
  };

  const availablePeriods = useMemo(() => {
    const periods = new Set();
    mspData.forEach(item => {
      if (item.months) {
        Object.keys(item.months).forEach(month => periods.add(month));
      }
    });
    return Array.from(periods).sort().reverse();
  }, [mspData]);

  const uniquePartNos = useMemo(() => {
    return Array.from(new Set(mspData.map(item => item.part_no)));
  }, [mspData]);

  const handleApplyFilter = (selectedPartNos) => {
    setFilteredPartNos(selectedPartNos);
    setShowFilter(false);
  };

  const filteredMspData = mspData.filter(item => filteredPartNos.includes(item.part_no));

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ padding: "20px 28px", marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 600 }}>
          Cost Analysis Report
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
              Period:
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #d1d5db",
                fontSize: 12
              }}
            >
              {availablePeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
              Compare with:
            </label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #d1d5db",
                fontSize: 12
              }}
            >
              {availablePeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th rowSpan={2} className="tbl-header" style={{ minWidth: 120, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Part No</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setShowFilter(!showFilter)}><FunnelIcon /></span>
                </div>
                {showFilter && (
                  <FilterDialog
                    title="Part No"
                    values={uniquePartNos}
                    onApply={handleApplyFilter}
                    onClose={() => setShowFilter(false)}
                  />
                )}
              </th>
              <th rowSpan={2} className="tbl-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Importer</span>
                  <span style={{ cursor: 'pointer' }}><FunnelIcon /></span>
                </div>
              </th>
              <th rowSpan={2} className="tbl-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Category</span>
                  <span style={{ cursor: 'pointer' }}><FunnelIcon /></span>
                </div>
              </th>
              <th rowSpan={2} className="tbl-header">Cost Item</th>
              
              {/* Calculation section */}
              <th colSpan={6} style={{ textAlign: "center", padding: "8px", background: "#a8d8f0", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
                Calculation
              </th>
              
              {/* Analysis section */}
              <th colSpan={analysisColumns.length} style={{ textAlign: "center", padding: "8px", background: "#f5d5a8", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
                Analysis
              </th>
              <th rowSpan={2} className="tbl-header" style={{minWidth: 70, background: "#bbfebb" }}>Remark</th>
            </tr>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th className="tbl-header" style={{ minWidth: 80, background: '#e3f6ff' }}>{comparisonPeriod}</th>
              <th className="tbl-header" style={{minWidth: 80, background: '#e3f6ff' }}>{selectedPeriod}</th>
              <th className="tbl-header" style={{minWidth: 70, background: '#e3f6ff' }}>diff Amt</th>
              <th className="tbl-header" style={{minWidth: 60, background: '#e3f6ff' }}>diff %</th>
              <th className="tbl-header" style={{minWidth: 70, background: '#e3f6ff' }}>PBMD</th>
              <th className="tbl-header" style={{minWidth: 70, background: '#e3f6ff' }}>Adj Value</th>
              {analysisColumns.map(col => (
                <th key={col} className="tbl-header"  style={{minWidth: 80, background: '#faebd7' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMspData.map((part) => (
              costItems.map((costItem, idx) => {
                let currentValue;
                let previousValue;

                if (costItem === "Total Purchase Cost") {
                  const toolingOHCurrent = getCostValue(part, selectedPeriod, "Tooling OH") || 0;
                  const rawMaterialCurrent = getCostValue(part, selectedPeriod, "Raw Material") || 0;
                  currentValue = toolingOHCurrent + rawMaterialCurrent;

                  const toolingOHPrevious = getCostValue(part, comparisonPeriod, "Tooling OH") || 0;
                  const rawMaterialPrevious = getCostValue(part, comparisonPeriod, "Raw Material") || 0;
                  previousValue = toolingOHPrevious + rawMaterialPrevious;
                } else if (costItem === "Total Process Cost") {
                  const laborCurrent = getCostValue(part, selectedPeriod, "Labor") || 0;
                  const fohFixCurrent = getCostValue(part, selectedPeriod, "FOH Fix") || 0;
                  const fohVarCurrent = getCostValue(part, selectedPeriod, "FOH Var") || 0;
                  const depreCommonCurrent = getCostValue(part, selectedPeriod, "Depre Common") || 0;
                  const depreExclusiveCurrent = getCostValue(part, selectedPeriod, "Depre Exclusive") || 0;
                  currentValue = laborCurrent + fohFixCurrent + fohVarCurrent + depreCommonCurrent + depreExclusiveCurrent;

                  const laborPrevious = getCostValue(part, comparisonPeriod, "Labor") || 0;
                  const fohFixPrevious = getCostValue(part, comparisonPeriod, "FOH Fix") || 0;
                  const fohVarPrevious = getCostValue(part, comparisonPeriod, "FOH Var") || 0;
                  const depreCommonPrevious = getCostValue(part, comparisonPeriod, "Depre Common") || 0;
                  const depreExclusivePrevious = getCostValue(part, comparisonPeriod, "Depre Exclusive") || 0;
                  previousValue = laborPrevious + fohFixPrevious + fohVarPrevious + depreCommonPrevious + depreExclusivePrevious;
                } else {
                  currentValue = getCostValue(part, selectedPeriod, costItem);
                  previousValue = getCostValue(part, comparisonPeriod, costItem);
                }
                
                const diffAmt = (currentValue !== null && previousValue !== null) ? currentValue - previousValue : null;
                const diffPercent = calculateDiff(currentValue, previousValue);
                const isLastRow = idx === costItems.length - 1;
                const isCalculatedRow = costItem === "Total Purchase Cost" || costItem === "Total Process Cost";
                const isSummaryRow = isCalculatedRow || costItem === "Total Cost";

                return (
                  <tr
                    key={`${part.part_no}-${costItem}`}
                    style={{
                      borderBottom: isLastRow ? "3px solid #d1d5db" : "1px solid #e5e7eb",
                      background: isSummaryRow ? "#f9facd" : (idx % 2 === 0 ? "#fafafa" : "#fff")
                    }}
                  >
                    {idx === 0 && (
                      <>
                        <td
                          rowSpan={costItems.length}
                          className="td-default"
                          style={{
                            fontWeight: "bold",
                            background: "#e8f1f7",
                            verticalAlign: "middle",
                            borderRight: "2px solid #d1d5db",
                            paddingLeft: "2px"
                          }}
                        >
                          {part.part_no}
                        </td>
                        <td
                          rowSpan={costItems.length}
                          style={{
                            fontWeight: "bold",
                            background: "#e8f1f7",
                            verticalAlign: "middle",
                            borderRight: "2px solid #d1d5db"
                          }}
                        >
                          {part.importer}
                        </td>
                        <td
                          rowSpan={costItems.length}
                          style={{
                            fontWeight: "bold",
                            background: "#e8f1f7",
                            verticalAlign: "middle",
                            borderRight: "2px solid #d1d5db"
                          }}
                        >
                          {part.category}
                        </td>
                      </>
                    )}
                    <td className="td-default" style={{fontWeight: isSummaryRow ? 'bold' : 500, borderRight: "1px solid #e5e7eb" }}>
                      {costItem}
                    </td>
                    <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal' }}>
                      {currentValue ? currentValue.toLocaleString() : "-"}
                    </td>
                    <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal' }}>
                      {previousValue ? previousValue.toLocaleString() : "-"}
                    </td>
                    <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal' }}>
                      {diffAmt !== null ? diffAmt.toLocaleString() : "-"}
                    </td>
                    <td className="td-default" style={{
                      textAlign: "right",
                      color: diffPercent && Math.abs(diffPercent) > 15 ? "#dc2626" : "inherit",
                      fontWeight: isSummaryRow ? 'bold' : (diffPercent && Math.abs(diffPercent) > 15 ? 600 : "normal")
                    }}>
                      {diffPercent ? `${diffPercent.toFixed(2)}%` : "-"}
                    </td>
                    <td className="td-default" style={{textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        value={isCalculatedRow ? "" : getPBMDValue(part, costItem) || ""}
                        onChange={(e) => handleCellChange(part.part_no, costItem, "PBMD", e.target.value)}
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                        disabled={isCalculatedRow}
                      />
                    </td>
                    <td className="td-default" style={{textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        value={isCalculatedRow ? "" : getAdjValue(part, costItem) || ""}
                        onChange={(e) => handleCellChange(part.part_no, costItem, "Adj", e.target.value)}
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                        disabled={isCalculatedRow}
                      />
                    </td>
                    {analysisColumns.map(col => (
                      <td key={col} className="td-default" style={{textAlign: "center" }}>
                        <input
                          type="text"
                          placeholder="-"
                          value={isCalculatedRow ? "" : getAnalysisValue(part, costItem, col) || ""}
                          onChange={(e) => handleCellChange(part.part_no, costItem, col, e.target.value)}
                          style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                          disabled={isCalculatedRow}
                        />
                      </td>
                    ))}
                    <td classNamestyle={{textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        value={isCalculatedRow ? "" : getRemarkValue(part) || ""}
                        onChange={(e) => handleCellChange(part.part_no, "__remark__", "Remark", e.target.value)}
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                        disabled={isCalculatedRow}
                      />
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FunnelIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4H21V6.58579C21 7.11236 20.7893 7.61714 20.4142 8L14 14.4142V20L10 22V14.4142L3.58579 8C3.21071 7.61714 3 7.11236 3 6.58579V4Z" />
  </svg>
);