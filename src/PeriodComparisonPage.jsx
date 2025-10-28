import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pprDataByPeriod } from "./data/pprSampleData";
import InlineEditableTextarea from "./components/InlineEditableTextarea";

const exchangeRates = {
  "Aug-25": "15,650",
  "Jul-25": "15,420",
  "Jun-25": "15,890",
};

const parseCurrency = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    if (value.trim() === "") {
      return 0;
    }
    return parseFloat(value.replace(/,/g, "")) || 0;
  }
  return 0;
};

export default function PeriodComparisonPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Aug-25");
  const [selectedMonth2, setSelectedMonth2] = useState("Jul-25");
  const [comparedMonth1, setComparedMonth1] = useState("");
  const [comparedMonth2, setComparedMonth2] = useState("");
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkValues, setRemarkValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const recordsPerPage = 10;
  const threshold = 10; // 10% threshold

  const handleCompare = () => {
    const data1 = pprDataByPeriod[selectedMonth];
    const data2 = pprDataByPeriod[selectedMonth2];

    const comparisonData = data2.map((currentPart, index) => {
      const prevPart = data1.find((p) => p.partNo === currentPart.partNo);

      if (!prevPart) {
        return {
          ...currentPart,
          no: index + 1,
          prevPeriod: 0,
          diff: 100,
          localOHPrev: 0,
          toolingOHPrev: 0,
          rawMaterialPrev: 0,
          laborPrev: 0,
          fohFixPrev: 0,
          fohVarPrev: 0,
          unfinishDeprePrev: 0,
          fgCostPrev: 0,
          mfgCostPrev: 0,
          sellingPricePrev: 0,
          totalCostPrev: 0,
          totalProcessCost: 0,
          totalProcessCostPrev: 0,
          exclusiveInvestment: 0,
          exclusiveInvestmentPrev: 0,
        };
      }

      const labor = parseCurrency(currentPart.labor);
      const fohFix = parseCurrency(currentPart.fohFix);
      const fohVar = parseCurrency(currentPart.fohVar);
      const unfinishDepre = parseCurrency(currentPart.unfinishDepre);

      const laborPrev = parseCurrency(prevPart.labor);
      const fohFixPrev = parseCurrency(prevPart.fohFix);
      const fohVarPrev = parseCurrency(prevPart.fohVar);
      const unfinishDeprePrev = parseCurrency(prevPart.unfinishDepre);

      const localOH = parseCurrency(currentPart.localOH);
      const toolingOH = parseCurrency(currentPart.toolingOH);
      const rawMaterial = parseCurrency(currentPart.rawMaterial);

      const localOHPrev = parseCurrency(prevPart.localOH);
      const toolingOHPrev = parseCurrency(prevPart.toolingOH);
      const rawMaterialPrev = parseCurrency(prevPart.rawMaterial);

      const totalProcessCost = labor + fohFix + fohVar + unfinishDepre;
      const totalProcessCostPrev =
        laborPrev + fohFixPrev + fohVarPrev + unfinishDeprePrev;

      const totalCost = localOH + toolingOH + rawMaterial + totalProcessCost;
      const prevTotalCost =
        localOHPrev + toolingOHPrev + rawMaterialPrev + totalProcessCostPrev;

      const diff =
        prevTotalCost === 0
          ? 100
          : ((totalCost - prevTotalCost) / prevTotalCost) * 100;

      return {
        ...currentPart,
        no: index + 1,
        totalCost: totalCost,
        diff: diff,
        localOH: localOH,
        toolingOH: toolingOH,
        rawMaterial: rawMaterial,
        labor: labor,
        fohFix: fohFix,
        fohVar: fohVar,
        unfinishDepre: unfinishDepre,
        localOHPrev: localOHPrev,
        toolingOHPrev: toolingOHPrev,
        rawMaterialPrev: rawMaterialPrev,
        laborPrev: laborPrev,
        fohFixPrev: fohFixPrev,
        fohVarPrev: fohVarPrev,
        unfinishDeprePrev: unfinishDeprePrev,
        fgCostPrev: parseCurrency(prevPart.fgCost),
        mfgCostPrev: parseCurrency(prevPart.mfgCost),
        sellingPricePrev: parseCurrency(prevPart.sellingPrice),
        totalCostPrev: prevTotalCost,
        totalProcessCost: totalProcessCost,
        totalProcessCostPrev: totalProcessCostPrev,
        exclusiveInvestment: parseCurrency(currentPart.exclusiveInvestment),
        exclusiveInvestmentPrev: parseCurrency(prevPart.exclusiveInvestment),
      };
    });

    setRows(comparisonData);
    setComparedMonth1(selectedMonth);
    setComparedMonth2(selectedMonth2);
    setCurrentPage(1);
  };

  const totalRecords = rows.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = rows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const isOutsideThreshold = (diff) => {
    return Math.abs(diff) > threshold;
  };

  const getRemarkValue = (partNo, originalRemark) => {
    return remarkValues[partNo] !== undefined
      ? remarkValues[partNo]
      : originalRemark;
  };

  const handleRemarkSave = (partNo, value) => {
    setRemarkValues((prev) => ({ ...prev, [partNo]: value }));
  };
  const handleDetailClick = (partNo) => {
    alert(`Detail view for Part: ${partNo}`);
  };

  const getDiffStyle = (diffValue, baseStyle) => {
    if (diffValue !== null && isOutsideThreshold(diffValue)) {
      return { ...baseStyle, color: "red", fontWeight: "bold" };
    }
    return baseStyle;
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: "95vw", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                className="btn"
                onClick={() => navigate(-1)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                }}
              >
                ← Back
              </button>
              <h1 style={{ margin: 0 }}>Period Comparison</h1>
            </div>
            <p style={{ margin: "6px 0 8px", color: "#6b7280" }}>
              Compare part process & cost report
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  marginTop: 4,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <option value="Aug-25">Aug-25</option>
                <option value="Jul-25">Jul-25</option>
                <option value="Jun-25">Jun-25</option>
              </select>
              <input
                type="text"
                value={`USD/IDR: ${
                  comparedMonth1 ? exchangeRates[comparedMonth1] : ""
                }`}
                readOnly
                style={{
                  marginTop: 4,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  width: "150px",
                  fontSize: "13px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <select
                value={selectedMonth2}
                onChange={(e) => {
                  setSelectedMonth2(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  marginTop: 4,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <option value="Aug-25">Aug-25</option>
                <option value="Jul-25">Jul-25</option>
                <option value="Jun-25">Jun-25</option>
              </select>
              <input
                type="text"
                value={`USD/IDR: ${
                  comparedMonth2 ? exchangeRates[comparedMonth2] : ""
                }`}
                readOnly
                style={{
                  marginTop: 4,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  width: "150px",
                  fontSize: "13px",
                }}
              />
            </div>

            <button className="btn btn-primary" onClick={handleCompare}>
              Compare
            </button>

            <button
              className="btn btn-primary"
              onClick={() => alert("Export CSV (preview)")}
              style={{ marginLeft: 16 }}
            >
              Export
            </button>
          </div>
        </div>

        <div style={{ height: 16 }} />

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
                  PartNo.
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
                  colSpan="6"
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
                    ...headerBandStyle("#e0aaff"),
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
                  {comparedMonth1}
                </th>
                <th style={{ ...thSticky, border: "1px solid #059669" }}>
                  {comparedMonth2}
                </th>
                <th style={{ ...thSticky, border: "1px solid #059669" }}>
                  % Diff
                </th>
                <th
                  style={{
                    ...thSticky,
                    backgroundColor: "#d0f0d2",
                    border: "1px solid #059669",
                  }}
                >
                  {comparedMonth1}
                </th>
                <th style={{ ...thSticky, border: "1px solid #059669" }}>
                  {comparedMonth2}
                </th>
                <th style={{ ...thSticky, border: "1px solid #059669" }}>
                  % Diff
                </th>

                <th
                  style={{
                    ...thSticky,
                    backgroundColor: "#a6f6f3",
                    border: "1px solid #059669",
                  }}
                >
                  {comparedMonth1}
                </th>
                <th
                  style={{
                    ...thSticky,
                    backgroundColor: "#b9faf8",
                    border: "1px solid #059669",
                  }}
                >
                  {comparedMonth2}
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
                  {comparedMonth1}
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
                  {comparedMonth1}
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
                  {comparedMonth1}
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
                  {comparedMonth1}
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
                const isEvenRow = index % 2 === 0;
                const currentRemark = getRemarkValue(r.partNo, r.remark);

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

                    {/* Purchase Part */}
                    <td style={tdPrevNum}>{formatNumber(r.localOHPrev)}</td>
                    <td style={tdNum}>{formatNumber(r.localOH)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(r.localOH, r.localOHPrev),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(r.localOH, r.localOHPrev)
                      )}
                    </td>
                    <td style={tdPrevNum}>{formatNumber(r.toolingOHPrev)}</td>
                    <td style={tdNum}>{formatNumber(r.toolingOH)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(r.toolingOH, r.toolingOHPrev),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(r.toolingOH, r.toolingOHPrev)
                      )}
                    </td>

                    {/* Raw Material */}
                    <td style={tdPrevNum}>
                      {formatNumber(r.rawMaterialPrev)}
                    </td>
                    <td style={tdNum}>{formatNumber(r.rawMaterial)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(
                          r.rawMaterial,
                          r.rawMaterialPrev
                        ),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(
                          r.rawMaterial,
                          r.rawMaterialPrev
                        )
                      )}
                    </td>

                    {/* Processing Cost */}
                    <td style={tdPrevNum}>{formatNumber(r.laborPrev)}</td>
                    <td style={tdNum}>{formatNumber(r.labor)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(r.labor, r.laborPrev),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(r.labor, r.laborPrev)
                      )}
                    </td>
                    <td style={tdPrevNum}>{formatNumber(r.fohFixPrev)}</td>
                    <td style={tdNum}>{formatNumber(r.fohFix)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(r.fohFix, r.fohFixPrev),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(r.fohFix, r.fohFixPrev)
                      )}
                    </td>
                    <td style={tdPrevNum}>{formatNumber(r.fohVarPrev)}</td>
                    <td style={tdNum}>{formatNumber(r.fohVar)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(r.fohVar, r.fohVarPrev),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(r.fohVar, r.fohVarPrev)
                      )}
                    </td>
                    <td style={tdPrevNum}>
                      {formatNumber(r.unfinishDeprePrev)}
                    </td>
                    <td style={tdNum}>{formatNumber(r.unfinishDepre)}</td>
                    <td
                      style={getDiffStyle(
                        calculatePercentageDiff(
                          r.unfinishDepre,
                          r.unfinishDeprePrev
                        ),
                        tdNum
                      )}
                    >
                      {formatPercentage(
                        calculatePercentageDiff(
                          r.unfinishDepre,
                          r.unfinishDeprePrev
                        )
                      )}
                    </td>

                    {/* Total Process Cost */}
                    <td style={tdPrevNum}>
                      {formatNumber(r.totalProcessCostPrev)}
                    </td>
                    {/* Exclusive Investment */}
                    <td style={tdPrevNum}>
                      {formatNumber(r.exclusiveInvestmentPrev)}
                    </td>

                    {/* Prev Period */}
                    <td style={tdPrevNum}>{formatNumber(r.totalCostPrev)}</td>
                    {/* Total Cost */}
                    <td style={tdNum}>{formatNumber(r.totalCost)}</td>
                    {/* Diff */}
                    <td style={getDiffStyle(r.diff, tdNum)}>
                      {formatPercentage(r.diff)}
                    </td>

                    {/* Remark */}
                    <td style={td}>
                      <InlineEditableTextarea
                        value={currentRemark}
                        onSave={(value) => handleRemarkSave(r.partNo, value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of{" "}
            {totalRecords} records
          </div>

          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-ghost"
              style={{
                padding: "4px 8px",
                fontSize: 12,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={
                    page === currentPage ? "btn btn-primary" : "btn btn-ghost"
                  }
                  style={{
                    padding: "4px 8px",
                    fontSize: 12,
                    minWidth: 32,
                  }}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-ghost"
              style={{
                padding: "4px 8px",
                fontSize: 12,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const td = {
  border: "1px solid #ddd",
  padding: "8px",
};

const tdNum = {
  ...td,
  textAlign: "right",
};

const tdPrev = {
  ...td,
  backgroundColor: "#e6f7ff",
};

const tdPrevNum = {
  ...tdPrev,
  textAlign: "right",
};

const th = {
  border: "1px solid #ddd",
  padding: "8px",
};

const formatNumber = (v) => {
  if (v == null || v === "") return "-";
  if (typeof v === "number")
    return v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
  if (current == null || previous == null || previous === 0) return null;
  const currentNum =
    typeof current === "string" ? parseFloat(current.replace(/,/g, '')) : current;
  const prevNum = typeof previous === "string" ? parseFloat(previous.replace(/,/g, '')) : previous;
  if (isNaN(currentNum) || isNaN(prevNum) || prevNum === 0) return null;
  return ((currentNum - prevNum) / prevNum) * 100;
};