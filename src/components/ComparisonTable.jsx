import React from 'react';
import {
  formatNumber,
  formatPercentage,
  calculatePercentageDiff,
} from '../utils/comparisonUtils';
import InlineEditableTextarea from './InlineEditableTextarea';

const ComparisonTable = ({
  currentRecords,
  getDiffStyle,
  handleDetailClick,
  getRemarkValue,
  handleRemarkSave,
  comparedMonth1,
  comparedMonth2,
}) => {
  if (currentRecords.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          border: '1px dashed #d1d5db',
          borderRadius: 8,
          backgroundColor: '#f9fafb',
          marginTop: 20,
        }}
      >
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Please select two periods and click "Compare" to see the results.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflow: "auto", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8 }}>
      <table style={{ borderCollapse: "collapse", minWidth: 1440, width: "100%" }}>
        <thead style={{ border: "2px solid #059669" }}>
          <tr style={{ border: "1px solid #059669" }}>
            <th rowSpan="2" style={{...headerBandStyle("#cccccc"), ...thSticky, border: "1px solid #059669"}}>No.</th>
            <th rowSpan="2" style={{...headerBandStyle("#cccccc"), ...thSticky, border: "1px solid #059669"}}>PartNo.</th>
            <th rowSpan="2" style={{...headerBandStyle("#cccccc"), ...thSticky, border: "1px solid #059669"}}>PartName</th>
            <th colSpan="6" style={{...headerBandStyle("#dff7e6"), border: "1px solid #059669"}}>Purchase Part</th>
            <th colSpan="3" style={{...headerBandStyle("#b9faf8"), border: "1px solid #059669"}}>Raw Material</th>
            <th colSpan="12" style={{...headerBandStyle("#e0aaff"), border: "1px solid #059669"}}>Processing Cost</th>
            <th rowSpan="2" style={{...headerBandStyle("#e0aaff"), ...thSticky, border: "1px solid #059669"}}>Total Process Cost</th>
            <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Exclusive Investment</th>
            <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Prev Period</th>
            <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Total Cost</th>
            <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Diff</th>
            <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Remark</th>
          </tr>
          <tr style={{ background: "#dff7e6", border: "1px solid #059669" }}>
            <th style={{...thSticky, backgroundColor: "#d0f0d2", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, border: "1px solid #059669"}}>Local OH</th>
            <th style={{...thSticky, border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#d0f0d2", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, border: "1px solid #059669"}}>Tooling OH</th>
            <th style={{...thSticky, border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#a6f6f3", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, backgroundColor: "#b9faf8", border: "1px solid #059669"}}>Current</th>
            <th style={{...thSticky, backgroundColor: "#b9faf8", border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#d89cff", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>Labor</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#d89cff", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>FOH Fixed</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#d89cff", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>FOH Var</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>% Diff</th>
            <th style={{...thSticky, backgroundColor: "#d89cff", border: "1px solid #059669"}}>Prev</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>Unfinish Depre.</th>
            <th style={{...thSticky, backgroundColor: "#e0aaff", border: "1px solid #059669"}}>% Diff</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((r, index) => {
            const currentRemark = getRemarkValue(r.partNo, r.remark);
            const isEvenRow = index % 2 === 0;
            
            return (
              <tr 
                key={r.partNo} 
                style={{ 
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  backgroundColor: isEvenRow ? "#f9fafb" : "white"
                }}
              >
                <td style={td}>{r.no}</td>
                <td style={td}>{r.partNo}</td>
                <td style={td}>{r.partName}</td>
                <td style={tdPrev}>{r.localOHPrev ?? "-"}</td>
                <td style={td}>{r.localOH ?? "-"}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.localOH, r.localOHPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.localOH, r.localOHPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.toolingOHPrev)}</td>
                <td style={td}>{formatNumber(r.toolingOH)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.toolingOH, r.toolingOHPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.toolingOH, r.toolingOHPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.rawMaterialPrev)}</td>
                <td style={td}>{formatNumber(r.rawMaterial)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.rawMaterial, r.rawMaterialPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.rawMaterial, r.rawMaterialPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.laborPrev)}</td>
                <td style={td}>{formatNumber(r.labor)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.labor, r.laborPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.labor, r.laborPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.fohFixPrev)}</td>
                <td style={td}>{formatNumber(r.fohFix)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.fohFix, r.fohFixPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.fohFix, r.fohFixPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.fohVarPrev)}</td>
                <td style={td}>{formatNumber(r.fohVar)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.fohVar, r.fohVarPrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.fohVar, r.fohVarPrev))}
                </td>
                <td style={tdPrev}>{formatNumber(r.unfinishDeprePrev)}</td>
                <td style={td}>{formatNumber(r.unfinishDepre)}</td>
                <td style={getDiffStyle(calculatePercentageDiff(r.unfinishDepre, r.unfinishDeprePrev), tdNum)}>
                  {formatPercentage(calculatePercentageDiff(r.unfinishDepre, r.unfinishDeprePrev))}
                </td>
                <td style={td}>{formatNumber(r.totalProcessCost)}</td>
                <td style={td}>{formatNumber(r.exclusiveInvestment)}</td>
                <td style={td}>{formatNumber(r.totalCostPrev)}</td>
                <td style={td}>{formatNumber(r.totalCost)}</td>
                <td style={getDiffStyle(r.diff, tdNum)}>
                  {formatPercentage(r.diff)}
                </td>
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
  );
};

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
  borderBottom: "1px solid rgba(0,0,0,0.06)"
};

const td = { padding: "8px 10px", fontSize: 13, color: "#111827" };
const tdNum = { ...td, textAlign: "right" };
const tdPrev = { ...td, backgroundColor: "#f5f5f5" };
const tdPrevNum = { ...tdPrev, textAlign: "right" };

export default ComparisonTable;