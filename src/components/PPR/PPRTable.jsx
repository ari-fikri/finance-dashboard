import React from "react";
import InlineEditableTextarea from "../InlineEditableTextarea";

const PPRTable = ({
  currentRecords,
  startIndex,
  isOutsideThreshold,
  getRemarkValue,
  handleRemarkSave,
  handleDetailClick,
  shouldShowRedTriangle,
}) => {
  const formatNumber = (v) => {
    if (v == null || v === "") return "-";
    if (typeof v === "number")
      return v.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    return v;
  };

  const formatPercentage = (v) => {
    if (v == null || v === "") return "-";
    if (typeof v === "number") {
      const formatted = v.toFixed(2);
      return v >= 0 ? `+${formatted}%` : `${formatted}%`;
    }
    return v;
  };

  const calculatePercentageDiff = (current, previous) => {
    if (!current || !previous || current === "" || previous === "") return null;
    const currentNum =
      typeof current === "string" ? parseFloat(current) : current;
    const prevNum =
      typeof previous === "string" ? parseFloat(previous) : previous;
    if (isNaN(currentNum) || isNaN(prevNum) || prevNum === 0) return null;
    return ((currentNum - prevNum) / prevNum) * 100;
  };

  const getTdDiffStyle = (diffValue) => {
    if (diffValue !== null && Math.abs(diffValue) > 15) {
      return { ...td, color: "red", fontWeight: "bold" };
    }
    return td;
  };

  const renderDiffCell = (current, previous) => {
    const diff = calculatePercentageDiff(current, previous);
    return (
      <td style={getTdDiffStyle(diff)}>
        {diff !== null ? formatPercentage(diff) : "-"}
      </td>
    );
  };

  return (
    <div
      style={{
        overflow: "auto",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 8,
      }}
    >
      <table
        style={{
          borderCollapse: "collapse",
          minWidth: 1440,
          width: "100%",
        }}
      >
        <thead style={{ border: "2px solid #059669" }}>
          <tr style={{ border: "1px solid #059669" }}>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#cccccc"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              No.
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#cccccc"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              PartNo
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#cccccc"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              PartName
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#cccccc"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Plant
            </th>
            <th
              colSpan="3"
              style={{
                ...headerBandStyle("#dff7e6"),
                border: "1px solid #059669",
              }}
            >
              Purchase Part
            </th>
            <th
              colSpan="3"
              style={{
                ...headerBandStyle("#b9faf8"),
                border: "1px solid #059669",
              }}
            >
              Raw Material
            </th>
            <th
              colSpan="12"
              style={{
                ...headerBandStyle("#e0aaff"),
                border: "1px solid #059669",
              }}
            >
              Processing Cost
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#e0aaff"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Total Process Cost
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#dff7e6"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Exclusive Investment
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#dff7e6"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Prev Period
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#dff7e6"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Total Cost
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#dff7e6"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Diff
            </th>
            <th
              rowSpan="2"
              style={{
                ...headerBandStyle("#dff7e6"),
                ...thSticky,
                border: "1px solid #059669",
              }}
            >
              Remark
            </th>
          </tr>

          <tr style={{ background: "#dff7e6", border: "1px solid #059669" }}>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#d0f0d2",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th style={{ ...thSticky, border: "1px solid #059669" }}>
              Tooling OH
            </th>
            <th style={{ ...thSticky, border: "1px solid #059669" }}>% Diff</th>

            <th
              style={{
                ...thSticky,
                backgroundColor: "#a6f6f3",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#b9faf8",
                border: "1px solid #059669",
              }}
            >
              Current
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#b9faf8",
                border: "1px solid #059669",
              }}
            >
              % Diff
            </th>

            <th
              style={{
                ...thSticky,
                backgroundColor: "#d89cff",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              Labor
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              % Diff
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#d89cff",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              FOH Fixed
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              % Diff
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#d89cff",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              FOH Var
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              % Diff
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#d89cff",
                border: "1px solid #059669",
              }}
            >
              Prev
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              Unfinish Depre.
            </th>
            <th
              style={{
                ...thSticky,
                backgroundColor: "#e0aaff",
                border: "1px solid #059669",
              }}
            >
              % Diff
            </th>
          </tr>
        </thead>

        <tbody>
          {currentRecords.map((r, index) => {
            const isThresholdExceeded = isOutsideThreshold(r.diff);
            const redStyle = isThresholdExceeded
              ? { ...td, color: "red", fontWeight: "bold" }
              : td;
            const currentRemark = getRemarkValue(r.partNo, r.remark);
            const isEvenRow = index % 2 === 0;

            return (
              <tr
                key={r.partNo}
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  backgroundColor: isEvenRow ? "#f9fafb" : "white",
                }}
              >
                <td style={td}>
                  {startIndex + currentRecords.indexOf(r) + 1}
                </td>
                <td style={td}>{r.partNo}</td>
                <td style={td}>{r.partName}</td>
                <td style={td}>{r.plant}</td>
                <td style={tdPrev}>{formatNumber(r.toolingOHPrev)}</td>
                <td style={td}>{formatNumber(r.toolingOH)}</td>
                {renderDiffCell(r.toolingOH, r.toolingOHPrev)}

                <td style={tdPrev}>{formatNumber(r.rawMaterialPrev)}</td>
                <td style={td}>{formatNumber(r.rawMaterial)}</td>
                {renderDiffCell(r.rawMaterial, r.rawMaterialPrev)}

                <td style={tdPrev}>{formatNumber(r.laborPrev)}</td>
                <td style={td}>{formatNumber(r.labor)}</td>
                {renderDiffCell(r.labor, r.laborPrev)}

                <td style={tdPrev}>{formatNumber(r.fohFixPrev)}</td>
                <td style={td}>{formatNumber(r.fohFix)}</td>
                {renderDiffCell(r.fohFix, r.fohFixPrev)}

                <td style={tdPrev}>{formatNumber(r.fohVarPrev)}</td>
                <td style={td}>{formatNumber(r.fohVar)}</td>
                {renderDiffCell(r.fohVar, r.fohVarPrev)}

                <td style={tdPrev}>{formatNumber(r.unfinishDeprePrev)}</td>
                <td style={td}>{formatNumber(r.unfinishDepre)}</td>
                {renderDiffCell(r.unfinishDepre, r.unfinishDeprePrev)}

                <td style={td}>{formatNumber(r.totalProcessCost)}</td>
                <td style={td}>{formatNumber(r.exclusiveInvestment)}</td>
                <td style={td}>{formatNumber(r.prevPeriod)}</td>
                <td style={{ ...redStyle, position: "relative" }}>
                  {formatNumber(r.averaged_cost)}
                  {shouldShowRedTriangle(r) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderTop: "12px solid red",
                        borderLeft: "12px solid transparent",
                      }}
                      title={`Prev Cost: ${formatNumber(r.totalCost)}`}
                    />
                  )}
                </td>
                <td style={redStyle}>{formatPercentage(r.diff)}</td>
                <td style={td}>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {isThresholdExceeded ? (
                        <InlineEditableTextarea
                          value={currentRemark}
                          onSave={(value) => handleRemarkSave(r.partNo, value)}
                          placeholder="Click to add remark..."
                        />
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          -
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDetailClick(r)}
                      style={{
                        padding: "2px 6px",
                        fontSize: 10,
                        border: "1px solid #007bff",
                        borderRadius: 3,
                        background: "#007bff",
                        color: "white",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* helpers and styles */
const headerBandStyle = (bg) => ({
  background: bg,
  height: 18,
  borderTop: "3px solid rgba(0,0,0,0.08)",
});

const thSticky = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 12,
  color: "#0b1220",
  fontWeight: 700,
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const td = { padding: "8px 10px", fontSize: 13, color: "#111827" };

// Background color for "Prev" data columns
const tdPrev = { ...td, backgroundColor: "#f5f5f5" };

export default PPRTable;