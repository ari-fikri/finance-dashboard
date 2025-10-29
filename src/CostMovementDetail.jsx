import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CostMovementDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { partNo } = useParams();

  // Data passed from PPRPage
  const { part, currentPeriod, comparisonPeriod } = location.state || {};

  // Dummy data for now - replace with actual data from `part`
  const detailData = {
    current: {
      toolingOuthouseCost: part?.toolingOuthouseCost || 100,
      laborCost: part?.labor || 50,
      fohFixed: part?.fohFix || 30,
      fohVariable: part?.fohVar || 20,
      unfinishedDepreciation: part?.unfinishDepre || 10,
      exclusiveInvestment: part?.exclusiveInvestment || 5,
    },
    comparison: {
      toolingOuthouseCost: part?.toolingOuthouseCostPrev || 90,
      laborCost: part?.laborPrev || 55,
      fohFixed: part?.fohFixPrev || 32,
      fohVariable: part?.fohVarPrev || 18,
      unfinishedDepreciation: part?.unfinishDeprePrev || 12,
      exclusiveInvestment: part?.exclusiveInvestmentPrev || 4,
    },
  };

  const formatNumber = (v) => {
    if (v == null || v === "") return "-";
    if (typeof v === "number") return v.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    return v;
  };

  const calculateDiff = (current, comparison) => {
    if (current == null || comparison == null) return "-";
    return formatNumber(current - comparison);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: '95vw', margin: '0 auto' }}>
        {/* Back button and Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              fontSize: 14,
              cursor: 'pointer',
              borderRadius: 6,
            }}
          >
            &larr; Back
          </button>
          <h1 style={{ margin: 0 }}>Cost Movement Detail</h1>
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>Part No</label>
            <input type="text" value={partNo} readOnly style={{ width: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: '#f8f9fa' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>Current Period</label>
            <select value={currentPeriod} style={{ width: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value={currentPeriod}>{currentPeriod}</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>Comparison Period</label>
            <select value={comparisonPeriod} style={{ width: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <option value={comparisonPeriod}>{comparisonPeriod}</option>
            </select>
          </div>
        </div>

        {/* Detail Section */}
        <h2>Cost Breakdown</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'left', fontSize: 14 }}>Cost Component</th>
              <th style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'right', fontSize: 14 }}>Current Period ({currentPeriod})</th>
              <th style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'right', fontSize: 14 }}>Comparison Period ({comparisonPeriod})</th>
              <th style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'right', fontSize: 14 }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Tooling Outhouse Cost</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.toolingOuthouseCost)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.toolingOuthouseCost)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.toolingOuthouseCost, detailData.comparison.toolingOuthouseCost)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Processing Cost</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}></td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}></td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}></td>
            </tr>
            <tr>
              <td style={{ padding: '8px 8px 8px 32px', border: '1px solid #ddd' }}>Labor Cost</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.laborCost)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.laborCost)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.laborCost, detailData.comparison.laborCost)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 8px 8px 32px', border: '1px solid #ddd' }}>FOH Fixed</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.fohFixed)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.fohFixed)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.fohFixed, detailData.comparison.fohFixed)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 8px 8px 32px', border: '1px solid #ddd' }}>FOH Variable</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.fohVariable)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.fohVariable)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.fohVariable, detailData.comparison.fohVariable)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 8px 8px 32px', border: '1px solid #ddd' }}>Unfinished Depreciation</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.unfinishedDepreciation)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.unfinishedDepreciation)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.unfinishedDepreciation, detailData.comparison.unfinishedDepreciation)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Exclusive Investment</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.current.exclusiveInvestment)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(detailData.comparison.exclusiveInvestment)}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{calculateDiff(detailData.current.exclusiveInvestment, detailData.comparison.exclusiveInvestment)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostMovementDetail;