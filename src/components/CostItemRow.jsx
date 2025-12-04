import React from "react";
import { ANALYSIS_COLUMNS, COST_ITEMS } from "../utils/pprConstants";
import { getAnalysisValue, getRemarkValue, getAnalysisValueForSummaryRow } from "../utils/pprHelpers";

export function CostItemRow(props) {
  const {
    part,
    costItem,
    idx,
    selectedPeriod,
    comparisonPeriod,
    calculateCostValues,
    calculateDiff,
    getDisplayValues,
    handleCellChange,
    analysisData
  } = props;

  const { currentValue, previousValue } = calculateCostValues(part, costItem, selectedPeriod, comparisonPeriod);
  const { pbmdDisplayValue, adjDisplayValue } = getDisplayValues(part, costItem);
  
  const diffAmt = (currentValue !== null && previousValue !== null) ? currentValue - previousValue : null;
  const diffPercent = calculateDiff(currentValue, previousValue);
  const isLastRow = idx === COST_ITEMS.length - 1;
  const isCalculatedRow = costItem === "Total Purchase Cost" || costItem === "Total Process Cost";
  const isSummaryRow = isCalculatedRow || costItem === "Total Cost";

  return (
    <tr
      style={{
        borderBottom: isLastRow ? "3px solid #d1d5db" : "1px solid #e5e7eb",
        background: isSummaryRow ? "#f9facd" : (idx % 2 === 0 ? "#fafafa" : "#fff")
      }}
    >
      {idx === 0 && (
        <>
          <td
            rowSpan={COST_ITEMS.length}
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
            rowSpan={COST_ITEMS.length}
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
            rowSpan={COST_ITEMS.length}
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
      }}>{diffPercent ? `${diffPercent.toFixed(2)}%` : "-"}</td>
      <td className="td-default" style={{textAlign: "center" }}>
        <input
          type="text"
          placeholder="-"
          value={pbmdDisplayValue}
          onChange={(e) => handleCellChange(part.part_no, costItem, "PBMD", e.target.value)}
          style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right" }}
          disabled={isCalculatedRow}
        />
      </td>
      <td className="td-default" style={{textAlign: "center" }}>
        <input
          type="text"
          placeholder="-"
          value={adjDisplayValue}
          onChange={(e) => handleCellChange(part.part_no, costItem, "Adj", e.target.value)}
          style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right" }}
          disabled={isCalculatedRow}
        />
      </td>
      {ANALYSIS_COLUMNS.map(col => {
        const analysisValue = isCalculatedRow ? getAnalysisValueForSummaryRow(part, costItem, col, analysisData) : getAnalysisValue(part, costItem, col, analysisData);
        const displayValue = (analysisValue !== null && analysisValue !== "" && analysisValue !== undefined) ? (typeof analysisValue === 'number' ? analysisValue.toLocaleString() : analysisValue) : "";
        return (
        <td key={col} className="td-default" style={{textAlign: "center" }}>
          <input
            type="text"
            placeholder="-"
            value={displayValue}
            onChange={(e) => handleCellChange(part.part_no, costItem, col, e.target.value)}
            style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right" }}
            disabled={isCalculatedRow}
          />
        </td>
      );
      })}
      <td className="td-default" style={{textAlign: "center" }}>
        <input
          type="text"
          placeholder="-"
          value={isCalculatedRow ? "" : getRemarkValue(part, analysisData) || ""}
          onChange={(e) => handleCellChange(part.part_no, "__remark__", "Remark", e.target.value)}
          style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right" }}
          disabled={isCalculatedRow}
        />
      </td>
    </tr>
  );
}