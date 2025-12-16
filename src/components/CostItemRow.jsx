/**
 * @file CostItemRow.jsx
 * @description This component renders a single row in the PPR table, representing a cost item for a specific part.
 * It displays calculated cost values, differences, and analysis data, and allows for editing certain fields.
 */

import React, { useState } from "react";
import { ANALYSIS_COLUMNS, COST_ITEMS } from "../utils/pprConstants";
import { getAnalysisValue, getRemarkValue, getAnalysisValueForSummaryRow } from "../utils/pprHelpers";

/**
 * A component that renders a single row for a cost item within the main table.
 *
 * @param {object} props - The props for the component.
 * @param {object} props.part - The part data for the current row.
 * @param {string} props.costItem - The name of the cost item for the current row.
 * @param {number} props.idx - The index of the current row.
 * @param {string} props.selectedPeriod - The currently selected reporting period.
 * @param {string} props.comparisonPeriod - The period to compare against.
 * @param {function} props.calculateCostValues - A function to calculate current and previous cost values.
 * @param {function} props.calculateDiff - A function to calculate the difference between two values.
 * @param {function} props.getDisplayValues - A function to get display values for PBMD and Adj.
 * @param {function} props.handleCellChange - A callback function to handle changes in cell values.
 * @param {object} props.analysisData - The analysis data for the current part.
 * @returns {JSX.Element} The rendered cost item row.
 */
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
    analysisData,
    filteredCostItemsCount
  } = props;

  // Calculate cost values for the current and previous periods.
  const { currentValue, previousValue } = calculateCostValues(part, costItem, selectedPeriod, comparisonPeriod);
  // Get display values for PBMD and Adj from analysis data.
  const { pbmdDisplayValue, adjDisplayValue } = getDisplayValues(part, costItem, analysisData);
  // State to manage the editing mode for the remarks column.
  const [isEditing, setIsEditing] = useState(false);

  // Calculate the difference amount and percentage.
  const diffAmt = (currentValue !== null && previousValue !== null) ? currentValue - previousValue : null;
  const diffPercent = calculateDiff(currentValue, previousValue);

  // Determine if the current row is the last row to apply a thicker border.
  const isLastRow = idx === filteredCostItemsCount - 1;
  // Determine if the row is a calculated row (summary rows that are not editable).
  const isCalculatedRow = costItem === "Total Purchase Cost" || costItem === "Total Process Cost" || costItem === "Total Cost";
  // Determine if the row is a summary row to apply special styling.
  const isSummaryRow = isCalculatedRow || costItem === "Total Cost";

  return (
    <tr
      style={{
        borderBottom: isLastRow ? "3px solid #d1d5db" : "1px solid #e5e7eb",
        background: isSummaryRow ? "#f9facd" : (idx % 2 === 0 ? "#fafafa" : "#fff")
      }}
    >
      {/* Render part details (Part No, Importer, Category) only for the first cost item row. */}
      {idx === 0 && (
        <>
          <td
            className="td-default"
            rowSpan={filteredCostItemsCount}
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
            className="td-default"
            rowSpan={filteredCostItemsCount}
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
            className="td-default"
            rowSpan={filteredCostItemsCount}
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
      {/* Cost Item column */}
      <td className="td-default" style={{fontWeight: isSummaryRow ? 'bold' : 500, borderRight: "1px solid #e5e7eb" }}>
        {costItem}
      </td>
      {/* Comparison Period Value */}
      <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal', padding:"6px" }}>
        {previousValue ? previousValue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "-"}
      </td>
      {/* PBMD Value */}
      <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal', padding:"6px" }}>
        {pbmdDisplayValue || "-"}
      </td>
      {/* Selected Period Value */}
      <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal', padding:"6px" }}>
        {currentValue ? currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "-"}
      </td>
      {/* Difference Amount */}
      <td className="td-default" style={{textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal', padding:"6px" }}>
        {diffAmt !== null ? diffAmt.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "-"}
      </td>
      {/* Difference Percentage */}
      <td className="td-default" style={{
        textAlign: "right",
        color: diffPercent && Math.abs(diffPercent) > 15 ? "#dc2626" : "inherit",
        fontWeight: isSummaryRow ? 'bold' : (diffPercent && Math.abs(diffPercent) > 15 ? 600 : "normal"),
        padding:"6px"
      }}>
        {diffPercent ? (
          `(${diffPercent.toFixed(2)}%)`
        ) : "-"}
      </td>
      {/* Adjustment Value */}
      <td className="td-default" style={{textAlign: "center" }}>
        <input
          type="text"
          placeholder="-"
          value={adjDisplayValue}
          onChange={(e) => handleCellChange(part.part_no, costItem, "Adj", e.target.value)}
          style={{ width: "100%", padding: "6px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal' }}
          disabled={isCalculatedRow}
        />
      </td>
      {/* Dynamically rendered analysis columns */}
      {ANALYSIS_COLUMNS.map(col => {
        const analysisValue = isCalculatedRow ? getAnalysisValueForSummaryRow(part, costItem, col, analysisData) : getAnalysisValue(part, costItem, col, analysisData);
        const displayValue = (analysisValue !== null && analysisValue !== "" && analysisValue !== undefined) ? (typeof analysisValue === 'number' ? analysisValue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : analysisValue) : "-";
        const isEditable = !["Volume", "Inflation", "CR", "Material Price Impact", "Gentan-I Impact", "Material Change"].includes(col);

        return (
        <td key={col} className="td-default" style={{textAlign: "center" }}>
          {isEditable ? (
            <input
              type="text"
              placeholder="-"
              value={displayValue === '-' ? '' : displayValue}
              onChange={(e) => handleCellChange(part.part_no, costItem, col, e.target.value)}
              style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "right", fontWeight: isSummaryRow ? 'bold' : 'normal' }}
              disabled={isCalculatedRow}
            />
          ) : (
            <span style={{ padding: "4px", fontSize: 11, fontWeight: isSummaryRow ? 'bold' : 'normal', textAlign: "right", display: 'block' }}>
              {displayValue}
            </span>
          )}
        </td>
      );
      })}
      {/* Remark column with in-place editing */}
      <td className="td-default" style={{textAlign: "center" }} onClick={() => !isCalculatedRow && setIsEditing(true)}>
        {isEditing ? (
          <textarea
            placeholder="-"
            value={isCalculatedRow ? "" : getRemarkValue(part, costItem, analysisData) || ""}
            onChange={(e) => handleCellChange(part.part_no, costItem, "Remark", e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            style={{ width: "100%", minHeight: "50px", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11, textAlign: "left", resize: "vertical" }}
            disabled={isCalculatedRow}
          />
        ) : (
          <span style={{ display: "block", width: "100%", minHeight: "24px", textAlign: "left", whiteSpace: "pre-wrap" }}>
            {isCalculatedRow ? "" : getRemarkValue(part, costItem, analysisData) || ""}
          </span>
        )}
      </td>
    </tr>
  );
}